import {
  EntityManager,
  EntityRepository,
  MikroORM,
  Options,
} from "@mikro-orm/postgresql";
import { Post } from "./entity/post/post.entity";

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  post: EntityRepository<Post>;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache;
  }

  const orm = await MikroORM.init(options);

  // Get SQL queries to update the schema
  const diff = await orm.schema.getUpdateSchemaSQL();
  console.log("Schema Update SQL Queries:");
  console.log(diff);

  // Run the SQL queries to update the schema
  await orm.schema.updateSchema();

  // save to cache before returning
  return (cache = {
    orm,
    em: orm.em,
    post: orm.em.getRepository(Post),
  });
}
