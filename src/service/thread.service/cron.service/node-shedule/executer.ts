import schedule from "./schedule";
import { Post } from "../../../../models";
import { IExecuter } from "../../../../types";
import { execute } from "./callback";

export class NodeScheduleExecuter implements IExecuter {
   public async create(post: Post): Promise<void> {
      const job = await schedule.create({ id: post.id, expireDate: post.expireDate, cb: execute });
      console.log(job);
   }
   public async update(post: Post): Promise<void> {
      console.log(post);
      const updated = await schedule.update({ id: post.id, expireDate: post.expireDate, cb: null });
      console.log(updated);
   }
   public async del(id: string): Promise<void> {
      await schedule.del(id);
   }
}
