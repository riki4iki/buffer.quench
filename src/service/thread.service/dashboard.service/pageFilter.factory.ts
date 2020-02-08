import { SocialType } from "../../../types/architecture/SocialTypes";
import { validatePageBySocial as facebookValidation } from "../page.thread/facebook.page/crud";

import { BadRequest } from "http-errors";

import { FacebookUser, Thread } from "../../../models";
import { ISocial, ISocialPageResponse } from "../../../types/architecture";

export type filterPromise = (social: ISocial, pageId: string) => Promise<ISocialPageResponse>;

export class FilterSelector {
   private static pages: { [type: string]: filterPromise } = {
      [SocialType.Facebook]: facebookValidation,
      default: (social: ISocial, pageId: string) => {
         const err = new BadRequest(`invalid input type of social, only the following types are currently available: ${Object.values(SocialType)}`);
         throw err;
      },
   };
   static selectFilter(type: string): filterPromise {
      const factory = FilterSelector.pages[type] || FilterSelector.pages.default;
      return factory;
   }
}
