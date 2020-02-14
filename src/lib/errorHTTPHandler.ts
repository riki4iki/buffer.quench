import { HttpError } from "http-errors";
import { Context } from "koa";

import { ValidationRequest } from "types/err";

const httpHandler = (err: HttpError, ctx: Context) => {
   console.log(err.stack);
   const isDev = process.env.NODE_ENV === "development";
   const isInternalServer = err.status === 500;
   const isUnvalidatedBadRequest = (err as ValidationRequest).validationArray;

   ctx.status = err.status || err.statusCode || 500;

   isUnvalidatedBadRequest && ctx.set("Content-Type", "application/json");

   const message = (isInternalServer && !isDev && "Internal server error") || err.message;
   ctx.res.end(message);
};
export { httpHandler };
