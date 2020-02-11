import { Page, Thread } from "../../../../models";
import { toDeleter } from "./updaters.type";
import { UpdatedPromisesFactory } from "./updatePromisesFactory";

export const convertPages = async (thread: Thread, pages: Page[]): Promise<toDeleter[]> => {
   const convertedPages = Promise.all(
      pages.map(async page => {
         const converted = await convertPage(thread, page);
         return converted;
      }),
   );
   return convertedPages;
};

const convertPage = async (thread: Thread, page: Page): Promise<toDeleter> => {
   const { pageId, type } = page;
   const { getterPromise, deleterPromise } = UpdatedPromisesFactory.selectUpdatePromises(type);
   const converted = await getterPromise(thread, pageId);
   return { converted, deleterPromise };
};
