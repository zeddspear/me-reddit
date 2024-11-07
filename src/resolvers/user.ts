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
import { __cookiename__ } from "../constants";

@InputType()
class UsernameAndPasswordInput {
  @Field()
  username: string;

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
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    // you are not logged in
    if (!req.session.userID) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userID as number });

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernameAndPasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length < 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username must be at least 3 characters long!",
          },
        ],
      };
    }

    if (options.password.length < 8) {
      return {
        errors: [
          {
            field: "password",
            message: "Password must be at least 8 characters long!",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);

    const user = em.create(User, {
      username: options.username,
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

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernameAndPasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    try {
      const user = await em.findOneOrFail(User, { username: options.username });

      const valid = await argon2.verify(user.password, options.password);

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
              field: "username",
              message: "Username does not exists",
            },
          ],
        };
      } else {
        return {
          errors: [{ field: "username", message: error.message }],
        };
      }
    }
  }

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
}
