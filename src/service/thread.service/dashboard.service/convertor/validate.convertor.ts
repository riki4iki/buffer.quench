import { socialConvertedType, validateConvertedType } from "./convertor.types";

export const validatePagesBySocial = (body: socialConvertedType[]): Promise<validateConvertedType[]> => {
   const validatedPages = Promise.all(
      body.map(async item => {
         const converted = await validatePage(item);
         return converted;
      }),
   );
   return validatedPages;
};

const validatePage = async (item: socialConvertedType): Promise<validateConvertedType> => {
   const { social, page, promises } = item;
   const validated = await promises.validatePagePromise(social, page);
   const promise = promises.connectionPromise;
   return { social, validated, promise };
};
