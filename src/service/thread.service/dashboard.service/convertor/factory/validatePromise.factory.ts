import { SocialType } from "types/architecture/SocialTypes";
import { validatePageBySocial as facebook } from "service/thread.service/page.thread/facebook.page/crud";

import { validatePromiseType } from "./factory.types";

class ValidatePromiseFactory {
   private static promise: { [type: string]: validatePromiseType } = {
      [SocialType.Facebook]: facebook,
   };
   public static selectPromise(type: string): validatePromiseType {
      const promise = ValidatePromiseFactory.promise[type];
      return promise;
   }
}
export { ValidatePromiseFactory };
