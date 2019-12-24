import { getManager, Repository, Equal, Not } from "typeorm";
import { Next, Context } from "koa";
import { Thread } from "../models";
import { ValidationError, validate } from "class-validator";
import { IAuthContext, IContext, IThreadState } from "../types";
/**
 * Class controller for path /user/thread. public static method for CRUd - GET, POST, UPDATE, DELETe
 */
export default class threadService {
  /**
   * Endpoint - get all thread by current user
   * @param ctx Context - Koa Context with IAuthContext type that contain extands state and params
   */
  public static async threadsEndPoint(ctx: IAuthContext) {
    //create thread repository
    const threadRepository: Repository<Thread> = getManager().getRepository(
      Thread
    );
    //find current user threads
    const threads: Array<Thread> = await threadRepository.find({
      user: ctx.state.user
    });

    ctx.body = threads;
  }
  /**
   * Middleware - get all current user threads middleware
   * @param ctx Context - Koa Context with IAuthContext type that contain extands state and params
   * @param next Next - Koa next for realize connection mechanics, use for chain methods
   */
  public static async threadsMiddleware(ctx: Context, next: Next) {
    const threadRepository: Repository<Thread> = getManager().getRepository(
      Thread
    );
    const threads: Array<Thread> = await threadRepository.find({
      user: ctx.state.user
    });

    ctx.state.threads = threads;
    await next();
  }
  /**
   * Endpoint - return current user thread by id
   * @param ctx Context - Koa Context with IAuthContext type that contain extands state and params
   */
  public static async threadEndPoint(ctx: IAuthContext) {
    const id: string = ctx.params.id;
    const threadRepository: Repository<Thread> = getManager().getRepository(
      Thread
    );

    const thread = await threadRepository.findOne({
      id: id,
      user: ctx.state.user
    });
    if (!thread) {
      ctx.status = 204;
    } else {
      ctx.body = thread;
    }
  }
  /**
   * Middleware - write current user thread by id in state
   * @param ctx Context - Koa Context with IAuthContext type that contain extands state and params
   * @param next Next - Koa next for realize connection mechanics, use for chain methods
   */
  public static async threadMiddleware(
    ctx: IContext<IThreadState>,
    next: Next
  ) {
    const id: string = ctx.params.id;
    const threadRepository: Repository<Thread> = getManager().getRepository(
      Thread
    );
    const thread: Thread = await threadRepository.findOne({
      id: id,
      user: ctx.state.user
    });
    if (!thread) {
      ctx.status = 400;
      ctx.body = "thread doesn't exist";
    } else {
      ctx.state.thread = thread;
      await next();
    }
  }
  /**
   * Endpoint - update thread. use for PUT method. return updated thread
   * @param ctx Context - Koa Context with IAuthContext type that contain extands state and params
   */
  public static async threadUpdateEndPoint(ctx: IAuthContext) {
    const id: string = ctx.params.id;

    const threadRepository: Repository<Thread> = getManager().getRepository(
      Thread
    );
    const thread = await threadRepository.findOne({
      id: id,
      user: ctx.state.user
    });

    const nextThread = new Thread();
    nextThread.id = thread.id;
    nextThread.user = thread.user;
    nextThread.name = ctx.request.body.name;

    const errors: ValidationError[] = await validate(nextThread);

    if (errors.length > 0) {
      ctx.status;
      ctx.body = errors.map(err => {
        return { property: err.property, constraints: err.constraints };
      });
    } else if (
      !(await threadRepository.findOne({ id: id, user: ctx.state.user }))
    ) {
      ctx.status = 400;
      ctx.body = "thread with id does not exist";
    } else if (
      await threadRepository.findOne({
        id: Not(Equal(id)),
        user: ctx.state.user,
        name: nextThread.name
      })
    ) {
      ctx.status = 400;
      ctx.body = `thread with name ${nextThread.name} already exist`;
    } else {
      ctx.status = 200;
      const thread = await threadRepository.save(nextThread);
      ctx.body = thread;
    }
  }
  /**
   * Endpoint - delete thread by id. use for DELETE http method. return 204
   * @param ctx Context - Koa Context with IAuthContext type that contain extands state and params
   */
  public static async threadDeleteEndPoint(ctx: IAuthContext) {
    const id: string = ctx.params.id;

    const threadRepository: Repository<Thread> = getManager().getRepository(
      Thread
    );
    const thread: Thread = await threadRepository.findOne({
      id: id,
      user: ctx.state.user
    });
    try {
      await threadRepository.remove(thread);
      ctx.status = 204;
    } catch (err) {
      ctx.app.emit("error", err, ctx);
    }
  }
  /**
   * Endpoint - create thread with input name in ctx.request.body.name. return 201 with created thread
   * @param ctx Context - Koa Context with IAuthContext type that contain extands state and params
   */
  public static async threadCreateEndPoint(ctx: IAuthContext) {
    const threadRepository: Repository<Thread> = getManager().getRepository(
      Thread
    );

    const thread = new Thread();

    thread.name = ctx.request.body.name;
    thread.user = ctx.state.user;

    const errors: ValidationError[] = await validate(thread);
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors.map(err => {
        return { property: err.property, constraints: err.constraints };
      });
    } else if (
      await threadRepository.findOne({
        user: ctx.state.user,
        name: thread.name
      })
    ) {
      ctx.status = 401;
      ctx.body = `thread with name '${thread.name}' already exist`;
    } else {
      const saved = await threadRepository.save(thread);
      ctx.status = 201;
      ctx.body = { id: saved.id, name: saved.name };
    }
  }
}
