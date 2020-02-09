import { convertedSocial, validatedPage } from "./convertors.type";

export const validatePagesBySocial = (body: convertedSocial[]) => {
   const validatedPages = Promise.all(
      body.map(async item => {
         const converted = await validatePage(item);
         return converted;
      }),
   );
   return validatedPages;
};

const validatePage = async (item: convertedSocial): Promise<validatedPage> => {
   const { social, page, promises } = item;
   const validated = await promises.validatePagePromise(social, page);
   const promise = promises.connectionPromise;
   return { social, validated, promise };
};
