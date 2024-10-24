import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity";

@Entity()
export class Post extends BaseEntity {
  @Property({ type: "text" })
  title!: string;
}
