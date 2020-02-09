import { getManager, Repository } from "typeorm";
import { BadRequest } from "http-errors";
import { Post, Thread, User } from "../../../../models";

export async function selectDashboardedThreadWithPost(user: User, id: string) {
   const threadRepository: Repository<Thread> = getManager().getRepository(Thread);
   const dashboarded = true;
   const thread = await threadRepository.findOne({ where: { id, user, dashboarded }, relations: ["posts", "page"] });
   if (!thread) {
      const err = new BadRequest("thread not found");
      throw err;
   } else {
      const posts = thread.posts;
      if (posts.length < 1) {
         //target thread haven't post
         const err = new BadRequest("thread haven't post");
         throw err;
      } else {
         const [post] = posts;
         const responsePages = Promise.all(thread.page.map(async page => await page.toResponse()));
         const pages = await responsePages;
         return { id: thread.id, post, pages };
      }
   }
}
