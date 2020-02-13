import { Thread, User } from "models";
import { ISocialPage, ISocial, ISocialPageResponse } from "types/architecture";

export type getterPromiseType = (thread: Thread, id: string) => Promise<ISocialPage>;
export type disconnecterPromiseType = (thread: Thread, id: string) => Promise<ISocialPage>;
export type connectorPromiseType = (thread: Thread, social: ISocial, page: ISocialPageResponse) => Promise<ISocialPage>;
export type socialPromiseType = (user: User, id: string) => Promise<ISocial>;
export type validatePromiseType = (social: ISocial, page: string) => Promise<ISocialPageResponse>;

export type connectionPromisesType = {
   socialPromise: socialPromiseType;
   validatePagePromise: validatePromiseType;
   connectionPromise: connectorPromiseType;
};

export type updatePromisesType = {
   getterPromise: getterPromiseType;
   disconnecterPromise: disconnecterPromiseType;
};
