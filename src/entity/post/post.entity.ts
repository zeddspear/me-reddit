import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @Property({ type: "text" })
  title!: string;
}
