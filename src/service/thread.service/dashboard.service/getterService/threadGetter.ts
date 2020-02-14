import { getManager, Repository } from "typeorm";
import { BadRequest } from "http-errors";
import { Thread, User } from "../../../../models";

export async function findThreadById(user: User, id: string): Promise<Thread> {
   const threadRepository: Repository<Thread> = getManager().getRepository(Thread);
   const thread = await threadRepository.findOne({ where: { user, id }, relations: ["posts", "page"] });
   if (!thread) {
      const err = new BadRequest("thread not found");
      throw err;
   } else if (thread.posts.length < 1) {
      console.log(thread);
      const err = new BadRequest("thread haven't post");
      throw err;
   } else {
      return thread;
   }
}
