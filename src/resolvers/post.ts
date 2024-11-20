import { MyContext } from "src/types";
import { Post } from "../entity/post/post.entity";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entity/user/user.entity";
import { isAuth } from "../middleware/isAuth";
import { QueryOrder } from "@mikro-orm/core";

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { em }: MyContext
  ): Promise<Post[]> {
    const maxLimit = Math.min(50, limit);
    console.log(limit);
    const qb = em.createQueryBuilder(Post);

    qb.select("*")
      .orderBy({ createdAt: QueryOrder.ASC })
      .limit(Number(maxLimit) ?? 10);

    if (cursor) {
      const convertedCursor = new Date(Number(cursor!));
      qb.where({ createdAt: { $gte: convertedCursor } });
    }

    return qb.execute();
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("options") options: PostInput,
    @Ctx() { em, req }: MyContext
  ): Promise<Post> {
    const user = await em.findOne(User, { id: Number(req.session.userID) });

    if (!user) {
      throw new Error("Logged in user is not authenticated");
    }

    const post = em.create(Post, {
      title: options.title,
      text: options.text,
      points: 0,
      creator: user,
    });

    console.log("Post: ", post);

    try {
      await em.persist(post).flush();
    } catch (error) {
      console.error("Error persisting post: ", error);
      throw new Error("Failed to create post");
    }

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await em.persist(post).flush();
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id", () => Int) id: number, @Ctx() { em }: MyContext) {
    await em.nativeDelete(Post, { id });
    return true;
  }
}
