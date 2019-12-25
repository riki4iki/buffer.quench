import { getManager, Repository, Not, Equal } from "typeorm";
import { Post, Thread } from "../../models";
import { ValidationError, validate } from "class-validator";
import { BadRequest } from "http-errors";
/**
 * Promise that return all posts for input thread from database
 * @param thread Thread - current thread from earlier route /thread/:id. required for posts finding
 */
export async function posts(thread: Thread): Promise<Array<Post>> {
  const postRepository: Repository<Post> = getManager().getRepository(Post);
  const posts: Array<Post> = await postRepository.find({ thread: thread });
  return posts;
}
/**
 * Promise that return target post by current thread and id from database
 * @param thread Thread - current thread from earlier route /thread/:id. required for posts finding
 * @param id String - post id. required for post identify
 */
export async function post(thread: Thread, id: string): Promise<Post> {
  const postRepository: Repository<Post> = getManager().getRepository(Post);
  const post: Post = await postRepository.findOne({ id: id, thread: thread });
  if (!post) {
    throw new BadRequest("Post not found");
  } else {
    return post;
  }
}
/**
 *Promise. Return new post saved to database
 * @param thread Thread - current thread from earlier route /thread/:id. required for creating relations
 * @param body IPostBody - input arguments for post crating:
 * - expireDate - date for post creating;
 * - context - post body.
 */
export async function create(thread: Thread, body: IPostBody) {
  const postRepository: Repository<Post> = getManager().getRepository(Post);
  const newPost = new Post();

  newPost.context = body.context; //input context - body
  newPost.expireDate = new Date(body.expireDate); //input date posting
  newPost.thread = thread;
  //validate dat instance
  const errors: ValidationError[] = await validate(newPost);

  if (errors.length > 0) {
    const err = new ValidationRequest();
    err.validationArray = errors.map(error => {
      return { property: error.property, constraints: error.constraints };
    });
    throw err;
  } else if (
    //check post with input date and context. must be unique
    await postRepository.findOne({
      expireDate: newPost.expireDate,
      thread: thread
    })
  ) {
    throw new BadRequest("target time already used for current thread");
  } else {
    //save post in db
    const savedPost: Post = await postRepository.save(newPost);
    return savedPost;
  }
}
/**
 * Promise. update and return target post for current thread
 * @param thread Thread - current thread from earlier route /thread/:id. required for creating relations
 * @param id String - post id. required for post identify
 * @param body IPostBody - input arguments for post crating:
 * - expireDate - date for post creating;
 * - context - post body.
 */
export async function update(thread: Thread, id: string, body: IPostBody) {
  const postRepository: Repository<Post> = getManager().getRepository(Post);

  const before = await postRepository.findOne({ id: id, thread: thread });
  if (!before) {
    throw new BadRequest("Post not found");
  } else {
    const newPost = new Post();
    newPost.id = before.id;
    newPost.thread = before.thread;
    newPost.context = body.context;
    newPost.expireDate = body.expireDate;
    const errors = await validate(newPost);
    if (errors.length > 0) {
      const err = new ValidationRequest();
      err.validationArray = errors.map(error => {
        return { property: error.property, constraints: error.constraints };
      });
      throw err;
    } else if (
      //check if post with input data exist's
      await postRepository.findOne({
        id: Not(Equal(id)),
        thread: thread,
        expireDate: newPost.expireDate
      })
    ) {
      throw new BadRequest("target time already used for current thread");
    } else {
      //save updated
      const after = await postRepository.save(newPost);
      return after;
    }
  }
}
/**
 * Promise. delete and return target post by id and thread
 * @param thread Thread - current thread from earlier route /thread/:id. required for creating relations
 * @param id String - post id. required for post identify
 */
export async function del(thread: Thread, id: string) {
  const postRepository: Repository<Post> = getManager().getRepository(Post);
  const post = await postRepository.findOne({ id: id, thread: thread });
  if (!post) {
    throw new BadRequest("Post not found");
  } else {
    //try to remove
    const removed = await postRepository.remove(post);
    return removed;
  }
}
interface IPostBody {
  context: string;
  expireDate: Date;
}
interface IValidationError {
  property: string;
  constraints: Object;
}
class ValidationRequest extends BadRequest {
  validationArray: Array<IValidationError>;
}
