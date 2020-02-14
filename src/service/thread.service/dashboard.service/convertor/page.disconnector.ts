import { Thread } from "models";
import { ISocialPage } from "types";

import { disconnectConevertedType } from "./convertor.types";

const disconnectPages = async (thread: Thread, toDelete: disconnectConevertedType[]): Promise<ISocialPage[]> => {
   const disconnectedPages = Promise.all(
      toDelete.map(async item => {
         const disconnected = await disconnectPage(thread, item);
         return disconnected;
      }),
   );
   return disconnectedPages;
};

const disconnectPage = async (thread: Thread, toDelete: disconnectConevertedType): Promise<ISocialPage> => {
   const { converted, disconnecterPromise } = toDelete;
   const disconnected = await disconnecterPromise(thread, converted.id);
   return disconnected;
};

export { disconnectPages };
