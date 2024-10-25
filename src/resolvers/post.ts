import { MyContext } from "src/types";
import { Post } from "../entity/post/post.entity";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.findAll(Post, {});
  }
}
