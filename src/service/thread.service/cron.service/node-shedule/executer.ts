import schedule from "./schedule";
import { Post } from "../../../../models";
import { IExecuter } from "../../../../types";
import { execute } from "./callback";

export class NodeScheduleExecuter implements IExecuter {
   public async create(post: Post): Promise<void> {
      await schedule.create({ id: post.id, expireDate: post.expireDate, cb: execute });
   }
   public async update(post: Post): Promise<void> {
      await schedule.update({ id: post.id, expireDate: post.expireDate, cb: null });
   }
   public async del(id: string): Promise<void> {
      await schedule.del(id);
   }
}
