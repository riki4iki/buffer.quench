import { Page, Thread } from "models";
import { disconnectConevertedType } from "./convertor.types";
import { UpdatePromisesFactory } from "./factory";

export const convertPages = async (thread: Thread, pages: Page[]): Promise<disconnectConevertedType[]> => {
   const convertedPages = Promise.all(
      pages.map(async page => {
         const converted = await convertPage(thread, page);
         return converted;
      }),
   );
   return convertedPages;
};

const convertPage = async (thread: Thread, page: Page): Promise<disconnectConevertedType> => {
   const { pageId, type } = page;
   const { getterPromise, disconnecterPromise } = UpdatePromisesFactory.selectPromises(type);
   const converted = await getterPromise(thread, pageId);
   return { converted, disconnecterPromise };
};
