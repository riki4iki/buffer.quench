import { User } from "models";
import { typeConvertedType, socialConvertedType } from "./convertor.types";

export const socialConvertors = async (user: User, body: typeConvertedType[]): Promise<socialConvertedType[]> => {
   const convertedSoicals = Promise.all(
      body.map(async item => {
         const converted = await socialConvertor(user, item);
         return converted;
      }),
   );
   return convertedSoicals;
};

const socialConvertor = async (user: User, item: typeConvertedType): Promise<socialConvertedType> => {
   const { socialId, page, promises } = item;
   const social = await promises.socialPromise(user, socialId);
   return { social, page, promises };
};
