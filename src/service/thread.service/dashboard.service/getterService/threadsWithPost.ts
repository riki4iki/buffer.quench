import { getManager, Repository } from "typeorm";

import { Thread, User } from "models";

export async function selectAllDashboardedThreadsWithPost(user: User) {
   const threadRepository: Repository<Thread> = getManager().getRepository(Thread);
   const threads = await threadRepository.find({ where: { user }, relations: ["posts", "page"] });
   const filterThread = threads.filter(thread => !(thread.posts.length < 1));
   const convertedThread = Promise.all(
      filterThread.map(async thread => {
         const convertPages = Promise.all(thread.page.map(async item => await item.toResponse()));
         const [post] = thread.posts;
         const pages = await convertPages;
         return { id: thread.id, post, pages };
      }),
   );
   return convertedThread;
}
