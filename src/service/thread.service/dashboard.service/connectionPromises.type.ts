import { ISocial, ISocialPage, ISocialPageResponse } from "../../../types";
import { SocialType } from "../../../types/architecture/SocialTypes";
import { User, Thread } from "../../../models";

import { BadRequest } from "http-errors";

export type ConnectionPromises = {
   socialPromise: (user: User, id: string) => Promise<ISocial>;
   filterPromise: (social: ISocial, pageId: string) => Promise<ISocialPageResponse>;
   connectionPromise: (thread: Thread, social: ISocial, page: ISocialPageResponse) => Promise<ISocialPage>;
};

export const failedTypePromises: ConnectionPromises = {
   socialPromise: (user: User, id: string) => badRequest(),
   filterPromise: (social: ISocial, pageId: string) => badRequest(),
   connectionPromise: (thread: Thread, social: ISocial, page: ISocialPageResponse) => badRequest(),
};

const badRequest = () => {
   const error = new BadRequest(`invalid input type of social, only the following types are currently available: ${Object.values(SocialType)}`);
   throw error;
};
