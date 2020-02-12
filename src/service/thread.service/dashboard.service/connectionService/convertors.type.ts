import { ConnectionPromises, connectionPromise, validatePagePromise } from "./connectionPromises.type";
import { ISocial, ISocialPageResponse } from "../../../../types";

export type convertedType = { socialId: string; page: string; promises: ConnectionPromises };

export type convertedSocial = {
   social: ISocial;
   page: string;
   promises: { validatePagePromise: validatePagePromise; connectionPromise: connectionPromise };
};

export type validatedPage = {
   social: ISocial;
   validated: ISocialPageResponse;
   promise: connectionPromise;
};
