import { PageBody } from "../validator/page.body";
import { ConnectionPromisesFactory } from "./factory";

import { typeConvertedType } from "./convertor.types";

export const typesToPromises = (body: PageBody[]): typeConvertedType[] => {
   const converted = body.map(item => typeToPromises(item));
   return converted;
};

const typeToPromises = (item: PageBody): typeConvertedType => {
   const { type, socialId, page } = item;
   const promises = ConnectionPromisesFactory.selectPromises(type);
   return { socialId, page, promises };
};
