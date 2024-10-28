import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  @Property({ type: "text" })
  password!: string;
}
