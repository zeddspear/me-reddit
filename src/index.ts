import config from "./mikro-orm.config";
import { initORM } from "./db";
import "dotenv/config";
import { __dbpassword__, __prod__ } from "./constants";
import { Post } from "./entity/post/post.entity";

async function main() {
  const db = await initORM(config);
}

main();
