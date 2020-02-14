import { ISocial, ISocialPageResponse, ISocialPage } from "types/architecture";

import { connectionPromisesType, validatePromiseType, connectorPromiseType, disconnecterPromiseType } from "./factory";

export type typeConvertedType = { socialId: string; page: string; promises: connectionPromisesType };
export type socialConvertedType = {
   social: ISocial;
   page: string;
   promises: { validatePagePromise: validatePromiseType; connectionPromise: connectorPromiseType };
};
export type validateConvertedType = {
   social: ISocial;
   validated: ISocialPageResponse;
   promise: connectorPromiseType;
};
export type disconnectConevertedType = {
   converted: ISocialPage;
   disconnecterPromise: disconnecterPromiseType;
};
