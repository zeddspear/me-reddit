import { OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";

export abstract class BaseEntity<Optional = never> {
  [OptionalProps]?: "createdAt" | "updatedAt" | Optional;

  @PrimaryKey()
  id!: number;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
