import { User } from "../entity/user/user.entity";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { __change_password_prefix, __cookiename__ } from "../constants";
import { validateRegisterUser } from "../utils/validate";
import sendEmail from "../utils/sendEmail";
import { v4 } from "uuid";

@InputType()
export class UsernameEmailAndPasswordInput {
  @Field()
  username?: string;

  @Field()
  email?: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  // Me query for checking if user is logged in
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    // you are not logged in
    if (!req.session.userID) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userID as number });

    return user;
  }

  // Register Mutation
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernameEmailAndPasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegisterUser(options);

    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);

    const user = em.create(User, {
      username: options.username!,
      email: options.email!,
      password: hashedPassword,
    });

    try {
      await em.persist(user).flush();
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [{ field: "username", message: "Username already exists" }],
        };
      }
    }

    return {
      user,
    };
  }

  // Login Mutation
  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    try {
      const user = await em.findOneOrFail(
        User,
        usernameOrEmail.includes("@")
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail }
      );

      const valid = await argon2.verify(user.password, password);

      if (!valid) {
        return {
          errors: [
            {
              field: "password",
              message: "Invalid Password",
            },
          ],
        };
      }

      req.session.userID = user.id;
      // to check if session is saving if not throw an error
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            reject(err);
          } else {
            resolve(null);
          }
        });
      });

      return {
        user,
      };
    } catch (error) {
      if (error.message.includes("User not found")) {
        return {
          errors: [
            {
              field: "usernameOrEmail",
              message: "User does not exists with this email or username",
            },
          ],
        };
      } else {
        return {
          errors: [{ field: "usernameOrEmail", message: error.message }],
        };
      }
    }
  }

  // Logout Mutation
  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(__cookiename__);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
        return;
      });
    });
  }

  // Forgot Password Link Generate Mutation
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em, redisClient }: MyContext
  ) {
    const user = await em.findOne(User, { email });
    if (!user) {
      return true;
    }

    const token = v4();

    await redisClient.set(
      `${__change_password_prefix}${token}`,
      user.id,
      "EX",
      1000 * 60 * 60 * 24 * 3
    );

    sendEmail(
      user.email,
      "Change Password",
      `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Change Password</title>
  </head>
  <body>
    <h1>Password Reset</h1>
    <p>Click the link below to reset your password:</p>

    <!-- Change Password link -->
    <a id="changePasswordLink" href="http://localhost:3000/change-password/${token}">Change Password</a>

  </body>
  </html>`
    );

    return true;
  }

  // Change Password Mutation
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("password") password: string,
    @Arg("token") token: string,
    @Ctx() { em, redisClient }: MyContext
  ): Promise<UserResponse> {
    if (password.length < 8) {
      return {
        errors: [
          {
            field: "password",
            message: "Password must be at least 8 characters long!",
          },
        ],
      };
    }

    const userId = await redisClient.get(`${__change_password_prefix}${token}`);
    if (!userId) {
      return {
        errors: [{ field: "token", message: "Token expired" }],
      };
    }

    const user = await em.findOne(User, { id: Number(userId) });

    if (!user) {
      return {
        errors: [{ field: "token", message: "User does not exist" }],
      };
    }

    user.password = await argon2.hash(password);

    await em.persist(user).flush();

    return { user };
  }
}
