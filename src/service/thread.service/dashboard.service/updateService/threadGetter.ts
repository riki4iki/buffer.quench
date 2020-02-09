import { getManager, Repository } from "typeorm";
import { BadRequest } from "http-errors";
import { Thread, User } from "../../../../models";

export async function findThreadById(user: User, id: string): Promise<Thread> {
   const dashboarded = true;
   const threadRepository: Repository<Thread> = getManager().getRepository(Thread);
   const thread = await threadRepository.findOne({ where: { user, id, dashboarded }, relations: ["posts", "page"] });
   if (!thread) {
      const err = new BadRequest("thread not fount");
      throw err;
   } else if (!(thread.posts.length < 0)) {
      const err = new BadRequest("thread haven't post");
      throw err;
   } else {
      return thread;
   }
}
