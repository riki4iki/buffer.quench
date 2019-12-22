import { getManager, Repository, Not, Equal } from "typeorm";
import {
  IContext,
  IThreadState,
  IParamContext,
  IParamIdState
} from "../interfaces";
import { Post, Thread } from "../models";
import { ValidationError, validate } from "class-validator";
import { scheduleJob, scheduledJobs } from "node-schedule";
/**
 * Class-controller for posts CRUD (creating, getting, updating, deleting)
 */
export default class PostService {
  /**
   * Endpoint - getting all posts for target thread current user
   * @param ctx Context - extended type for work with state.thread
   */
  public static async postsEndPoint(ctx: IContext<IThreadState>) {
    //current thread from state
    const thread: Thread = ctx.state.thread;
    //create psot repos
    const postRepository: Repository<Post> = getManager().getRepository(Post);
    //find all posts by thread
    const posts: Array<Post> = await postRepository.find({ thread: thread });
    ctx.body = posts; //return array
  }
  /**
   * Endpoint - get target post by id for target current user thread
   * @param ctx Context - extended type for work with state.thread and params.id
   */
  public static async postEndPoint(
    ctx: IParamContext<IThreadState, IParamIdState>
  ) {
    const thread = ctx.state.thread; // from state.thread
    const id = ctx.params.id; // from parsed url localhost:1337/api/v1/user/thread/(:threadId)/post/:id
    const postRepository: Repository<Post> = getManager().getRepository(Post);
    //find in database
    const post = await postRepository.findOne({ id: id, thread: thread });
    if (!post) {
      //there is no post in database with dat thread
      ctx.status = 204;
    } else {
      ctx.status = 200;
      ctx.body = post;
    }
  }
  /**
   * Endpoints - create new post for target thread, return created post
   * inputs:
   * - expireDate - date for post creating;
   * - context - post body.
   * @param ctx Context - extended type for work with state.thread
   */
  public static async postCreateEndPoint(ctx: IContext<IThreadState>) {
    const thread = ctx.state.thread;

    //create new Post instance
    const newPost = new Post();

    newPost.context = ctx.request.body.context; //input context - body
    newPost.expireDate = new Date(ctx.request.body.expireDate); //input date posting
    newPost.thread = thread;

    const postRepository: Repository<Post> = getManager().getRepository(Post);

    //validate dat instance
    const errors: ValidationError[] = await validate(newPost);

    if (errors.length > 0) {
      //validation errors
      ctx.status = 400;
      ctx.body = errors.map(err => {
        return { property: err.property, constraints: err.constraints };
      });
    } else if (
      //check post with input date and context. must be unique
      await postRepository.findOne({
        expireDate: newPost.expireDate,
        context: newPost.context,
        thread: thread
      })
    ) {
      ctx.status = 400;
      ctx.body =
        "input post with context and date for target thread already exist";
    } else {
      //save post in db
      const savedPost: Post = await postRepository.save(newPost);
      const cron = scheduleJob(
        `${savedPost.id}`,
        "*/5 * * * * * ",
        function test() {
          console.log(savedPost.id);
        }
      );

      ctx.status = 201;
      ctx.body = savedPost;
    }
  }
  /**
   * Endpoint - update target post, return updated post.
   * inputs:
   * - expireDate - date for post creating;
   * - context - post body.
   * @param ctx Context - extended type for work with state.thread
   */
  public static async postUpdateEndPoint(
    ctx: IParamContext<IThreadState, IParamIdState>
  ) {
    //update only for Date and context
    const thread = ctx.state.thread;
    const id = ctx.params.id;
    const postRepository: Repository<Post> = getManager().getRepository(Post);
    //find by input id - localhost:1337/api/v1/user/thread/(:threadId)/post/:id
    const post = await postRepository.findOne({ id: id, thread: thread });
    if (!post) {
      //post doesn't exist in database
      ctx.status = 204;
    } else {
      //post exist, create new instance for updating
      const newPost = new Post();
      newPost.id = post.id;
      newPost.thread = post.thread;
      newPost.expireDate = new Date(ctx.request.body.expireDate); // input
      newPost.context = ctx.request.body.context; //input
      const errors: ValidationError[] = await validate(newPost);
      if (errors.length > 0) {
        //valdation errors
        ctx.status = 400;
        ctx.body = errors.map(err => {
          return { property: err.property, constraints: err.constraints };
        });
      } else if (
        //check if post with input data exist's
        await postRepository.findOne({
          id: Not(Equal(id)),
          thread: thread,
          context: newPost.context,
          expireDate: newPost.expireDate
        })
      ) {
        ctx.status = 400;
        ctx.body = "post with inputs context and date already exist";
      } else {
        //save updated
        const savedPost = await postRepository.save(newPost);
        ctx.status = 200;
        ctx.body = savedPost;
      }
    }
  }
  /**
   * Endpoints - delete target post, return 204
   * @param ctx  Context - extended type for work with state.thread
   */
  public static async postDeleteEndPoint(
    ctx: IParamContext<IThreadState, IParamIdState>
  ) {
    const thread = ctx.state.thread;
    const id = ctx.params.id;

    const postRepository: Repository<Post> = getManager().getRepository(Post);
    const post = await postRepository.findOne({ id: id, thread: thread });
    try {
      //try to remove
      await postRepository.remove(post);
      console.log(scheduleJob);
      ctx.body = scheduledJobs;
    } catch (err) {
      ctx.body = err;
    }
  }
}
