import { Context, Next } from "koa";
import { IValidator, Validator } from "../types";
/**
 * Class with common/abstract middlewares
 */
export default class apiService {
  /**
   * Middleware for validate input param /:id from query string. With validation error return 400 status with message: 'uuid validation error'
   * @param ctx Context - Koa context that has request and response types
   * @param next - Next - Koa next that reliazed connection mechanics
   */
  public static async validateUUIDMiddleware(ctx: Context, next: Next) {
    const id: string = ctx.params.id;
    const uuid = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/.test(
      //validate by regex
      id
    );
    if (!uuid) {
      ctx.status = 400;
      ctx.body = "uuid validation error";
    } else {
      await next(); // next endpoint
    }
  }
}
