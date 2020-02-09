import { IUknownPageBody } from "../../../../types/body";

import { ConnectionPromisesFactory } from "./connectionPromises.factory";
import { convertedType } from "./convertors.type";

export const typesToPromises = (body: IUknownPageBody[]) => {
   const converted = body.map(item => typeToPromises(item));
   return converted;
};

const typeToPromises = (item: IUknownPageBody): convertedType => {
   const { type, socialId, page } = item;
   const promises = ConnectionPromisesFactory.selectPromises(type);
   return { socialId, page, promises };
};
