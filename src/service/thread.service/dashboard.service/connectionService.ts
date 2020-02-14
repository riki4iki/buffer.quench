import { Thread, User } from "models";
import { create as createThread } from "service/thread.service/crud";

import { PageBody } from "./validator/page.body";

import { typesToPromises, validatePagesBySocial, socialConvertors, connectPages } from "./convertor";

const createThreadAndConnect = async (user: User, pages: PageBody[]): Promise<Thread> => {
   const promisedPages = await typesToPromises(pages);
   const socialPages = await socialConvertors(user, promisedPages);
   const validatedPages = await validatePagesBySocial(socialPages);

   const thread = await createThread(user, { name: new Date().getTime().toString() });

   const connectedPages = await connectPages(thread, validatedPages);
   console.log(connectedPages);

   return thread;
};

export { createThreadAndConnect };
