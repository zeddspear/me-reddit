import { MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next): any => {
  if (!context.req.session.userID) {
    throw new Error("Not authenticated");
  }

  return next();
};
