import { Post, Thread } from "models";
import { create, update } from "service/thread.service/post.service/crud";
import { NodeScheduleExecuter } from "service/thread.service/cron.service/node-shedule/executer";

const createPost = async (thread: Thread, post: Post): Promise<Thread> => {
   const created = await create(thread, post);
   console.log(created);
   const executer = new NodeScheduleExecuter();
   const task = executer.create(created);
   console.log(task);
   return thread;
};
const updatePost = async (thread: Thread, before: Post, after: Post): Promise<Thread> => {
   const updated = await update(thread, before.id, after);
   console.log(updated);
   const executer = new NodeScheduleExecuter();
   const task = executer.update(updated);
   console.log(task);
   return thread;
};

export { createPost, updatePost };
