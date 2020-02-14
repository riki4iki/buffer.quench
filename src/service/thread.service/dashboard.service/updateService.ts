import { User, Thread } from "models";

import { typesToPromises, convertPages, socialConvertors, validatePagesBySocial, difference, connectPages, disconnectPages } from "./convertor";
import { PageBody } from "./validator/page.body";

const updateThreadPages = async (user: User, thread: Thread, after: PageBody[]): Promise<Thread> => {
   const promisedPages = await typesToPromises(after);
   const socialedPages = await socialConvertors(user, promisedPages);
   const validatedPages = await validatePagesBySocial(socialedPages);

   const convertedBeforePages = await convertPages(thread, thread.page);

   const { toConnect, toDisconnect } = await difference(convertedBeforePages, validatedPages);

   const connected = await connectPages(thread, toConnect);
   console.log(connected);
   const disconnected = await disconnectPages(thread, toDisconnect);
   console.log(disconnected);

   return thread;
};

export { updateThreadPages };
