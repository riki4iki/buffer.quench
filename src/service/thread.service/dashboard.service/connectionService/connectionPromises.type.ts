import { ISocial, ISocialPage, ISocialPageResponse } from "../../../../types";
import { SocialType } from "../../../../types/architecture/SocialTypes";
import { User, Thread } from "../../../../models";

import { BadRequest } from "http-errors";

export type socialPromise = (user: User, id: string) => Promise<ISocial>;
export type validatePagePromise = (social: ISocial, page: string) => Promise<ISocialPageResponse>;
export type connectionPromise = (thread: Thread, social: ISocial, page: ISocialPageResponse) => Promise<ISocialPage>;

export type ConnectionPromises = {
   socialPromise: socialPromise;
   validatePagePromise: validatePagePromise;
   connectionPromise: connectionPromise;
};

export const failedTypePromises: ConnectionPromises = {
   socialPromise: (user: User, id: string) => badRequest(),
   validatePagePromise: (social: ISocial, page: string) => badRequest(),
   connectionPromise: (thread: Thread, social: ISocial, page: ISocialPageResponse) => badRequest(),
};

const badRequest = () => {
   const error = new BadRequest(`invalid input type of social, only the following types are currently available: ${Object.values(SocialType)}`);
   throw error;
};
