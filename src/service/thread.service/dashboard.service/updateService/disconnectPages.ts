import { toDeleter } from "./updaters.type";
import { Thread } from "../../../../models";
import { ISocialPage } from "../../../../types";

export const disconnectPages = async (thread: Thread, toDelete: toDeleter[]): Promise<ISocialPage[]> => {
   const disconnectedPages = Promise.all(
      toDelete.map(async item => {
         const disconnected = await disconnectPage(thread, item);
         return disconnected;
      }),
   );
   return disconnectedPages;
};

const disconnectPage = async (thread: Thread, toDelete: toDeleter): Promise<ISocialPage> => {
   const { converted, deleterPromise } = toDelete;
   const disconnected = await deleterPromise(thread, converted.id);
   return disconnected;
};
