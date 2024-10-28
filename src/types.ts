import {
  SqlEntityManager,
  AbstractSqlDriver,
  AbstractSqlConnection,
  AbstractSqlPlatform,
} from "@mikro-orm/postgresql";
import { Request, Response } from "express";

export type MyContext = {
  em: SqlEntityManager<
    AbstractSqlDriver<AbstractSqlConnection, AbstractSqlPlatform>
  >;
  req: Request;
  res: Response;
};
