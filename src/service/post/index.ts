import { post as target, posts as all, create, update, del } from "./crud";
import { Next } from "koa";
import {
  IContext,
  IThreadState,
  IPostState,
  IParamContext,
  IParamIdState
} from "interfaces";

export default class postController {
  //#region 'EndPoints'
  public static async postsEndPoint(
    ctx: IContext<IThreadState>
  ): Promise<void> {
    try {
      const posts = await all(ctx.state.thread);
      ctx.status = 200;
      ctx.body = posts;
    } catch (err) {
      ctx.app.emit("error", err, ctx);
    }
  }

  public static async postEndPoint(
    ctx: IParamContext<IThreadState, IParamIdState>
  ) {
    try {
      const post = await target(ctx.state.thread, ctx.params.id);
      ctx.status = 200;
      ctx.body = post;
    } catch (err) {
      ctx.app.emit("error", err, ctx);
    }
  }
  public static async postCreateEndPoint(ctx: IContext<IThreadState>) {
    try {
      const post = await create(ctx.state.thread, {
        context: ctx.request.body.context,
        expireDate: new Date(ctx.request.body.expireDate)
      });
      ctx.status = 201;
      ctx.body = post;
    } catch (err) {
      ctx.app.emit("error", err, ctx);
    }
  }

  public static async postUpdateEndPoint(
    ctx: IParamContext<IThreadState, IParamIdState>
  ) {
    try {
      const post = await update(ctx.state.thread, ctx.params.id, {
        context: ctx.request.body.context,
        expireDate: new Date(ctx.request.body.expireDate)
      });
      ctx.status = 200;
      ctx.body = post;
    } catch (err) {
      ctx.app.emit("error", err, ctx);
    }
  }
  public static async postDeleteEndPoint(
    ctx: IParamContext<IThreadState, IParamIdState>
  ) {
    try {
      const post = await del(ctx.state.thread, ctx.params.id);
      ctx.status = 204;
    } catch (err) {
      ctx.app.emit("error", err, ctx);
    }
  }
  //#endregion 'EndPoints'
  //#region  'Middlewares'
  public static async postsMiddleware(ctx: IContext<IPostState>, next: Next) {}
  public static async postMiddleware(
    ctx: IParamContext<IPostState, IParamIdState>,
    next: Next
  ) {}
  public static async postCreateMiddleware(
    ctx: IContext<IPostState>,
    next: Next
  ) {}
  public static async postUpdateMiddleware(
    ctx: IParamContext<IPostState, IParamIdState>,
    next: Next
  ) {}

  public static async postDeleteMiddleware(
    ctx: IParamContext<IPostState, IParamIdState>,
    next: Next
  ) {}
  //#endregion 'Middlewares
}
