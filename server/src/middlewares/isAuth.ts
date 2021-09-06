import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({context}, next) => {
  if(!context.userId) {
    throw new Error("Not Authenticated");
  }
  return next();
}