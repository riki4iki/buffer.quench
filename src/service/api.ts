import { DefaultState, Next } from "koa";
import { BadRequest } from "http-errors";
import { IParamContext, IParamIdState } from "../types";
/**
 * Class with common/abstract middlewares
 */
export default class apiService {
   /**
    * Middleware for validate input param /:id from query string. With validation error return 400 status with message: 'uuid validation error'
    * @param ctx Context - Koa context that has request and response types
    * @param next - Next - Koa next that reliazed connection mechanics
    */
   public static async validateUUIDMiddleware(ctx: IParamContext<DefaultState, IParamIdState>, next: Next) {
      try {
         const resourceName = await getResouceName(ctx.URL.pathname, ctx.params.id);
         const uuid = await apiService.validateUUID(ctx.params.id, resourceName);
         await next();
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    *  Promsie. check uuid format of input string. return dat string or throw bad request
    * @param str Strinf - unput uuid to parse
    * @param name String - name of resource to identification at catch. Give information to clien what a resource catched
    */
   public static async validateUUID(str: string, name: string) {
      const uuid = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/.test(
         //validate by regex
         str,
      );
      if (!uuid) {
         const err = new BadRequest(`uuid validation error at ${name}`);
         throw err;
      }
      return str;
   }
   /**
    *Promise - return parsed array with page id's
    * @param str String - input string from ctx.request.body.pages that present page array for connection to thread from precious middleware
    */
   public static async StringToArray(pages: any): Promise<string[]> {
      if (Array.isArray(pages)) {
         return pages;
      } else {
         try {
            const str = pages.toString();
            const pagesString: string = str.replace(/'/g, '"');
            console.log("after replace" + pagesString);
            const pagesIdArray: Array<string> = JSON.parse(pagesString);
            console.log("parsed" + pagesIdArray);
            return pagesIdArray;
         } catch (err) {
            const badRequest = new BadRequest(`input pages array exception: ${err.message}`);
            throw badRequest;
         }
      }
   }
}

//parse input url to identify resource name id that came
const getResouceName = async (url: string, id: string): Promise<string> => {
   const routesArray: string[] = url.split("/");
   const index_id = routesArray.indexOf(id);
   if (index_id < 0) {
      return "undefined";
   }
   return routesArray[index_id - 1];
};
