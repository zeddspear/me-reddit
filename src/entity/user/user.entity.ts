import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity";
import { Field, ObjectType } from "type-graphql";
import { Post } from "../post/post.entity";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  @Field()
  @Property({ type: "text", unique: true })
  email!: string;

  @Property({ type: "text" })
  password!: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts = new Collection<Post>(this);
}
