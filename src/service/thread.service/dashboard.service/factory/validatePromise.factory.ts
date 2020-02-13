import { SocialType } from "types/architecture/SocialTypes";
import { validatePageBySocial as facebook } from "service/thread.service/page.thread/facebook.page/crud";
import { factoryBadRequest } from "./badRequest.error";

import { validatePromiseType } from "./factory.types";

class ValidatePromiseFactory {
   private static promise: { [type: string]: validatePromiseType } = {
      [SocialType.Facebook]: facebook,
      default: factoryBadRequest(),
   };
   public static selectPromise(type: string): validatePromiseType {
      const promise = ValidatePromiseFactory.promise[type] || ValidatePromiseFactory.promise.default;
      return promise;
   }
}
export { ValidatePromiseFactory };
