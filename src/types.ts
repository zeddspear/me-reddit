import {
  SqlEntityManager,
  AbstractSqlDriver,
  AbstractSqlConnection,
  AbstractSqlPlatform,
} from "@mikro-orm/postgresql";
import { Request, Response } from "express";
import { Redis } from "ioredis";

export type MyContext = {
  em: SqlEntityManager<
    AbstractSqlDriver<AbstractSqlConnection, AbstractSqlPlatform>
  >;
  req: Request;
  res: Response;
  redisClient: Redis;
};
