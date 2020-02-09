import { Page, Thread } from "../../../../models";
import { GetterPromiseFactory } from "./getterPromise.factory";

export const convertPages = async (thread: Thread, pages: Page[]) => {
   const convertedPages = Promise.all(
      pages.map(async page => {
         const converted = await convertPage(thread, page);
         return converted;
      }),
   );
   return convertedPages;
};

const convertPage = async (thread: Thread, page: Page) => {
   const { pageId, type } = page;
   const promise = GetterPromiseFactory.getterSelector(type);
   const converted = await promise(thread, pageId);
   return converted;
};
