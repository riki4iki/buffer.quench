import { convertedSocial, convertedType } from "./convertors.type";
import { User } from "../../../../models";

export const socialConvertors = async (user: User, body: convertedType[]): Promise<convertedSocial[]> => {
   const convertedSoicals = Promise.all(
      body.map(async item => {
         const converted = await socialConvertor(user, item);
         return converted;
      }),
   );
   return convertedSoicals;
};

const socialConvertor = async (user: User, item: convertedType): Promise<convertedSocial> => {
   const { socialId, page, promises } = item;
   const social = await promises.socialPromise(user, socialId);
   return { social, page, promises };
};
