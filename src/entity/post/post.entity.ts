import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity";
import { Field, ObjectType } from "type-graphql";
import { User } from "../user/user.entity";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @Property({ type: "text" })
  title!: string;

  @Field()
  @Property({ type: "text" })
  text!: string;

  @Field()
  @Property({ type: "int", default: 0 })
  points!: number;

  @ManyToOne(() => User)
  creator: User;
}
