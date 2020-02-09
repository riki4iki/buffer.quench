import { IContext, IAuthState, IParamContext, IParamIdState } from "../../../types/koa";
import { create as createThread, all as selectAllThread, get as selectTargetThread, del as deleteThread, update as updateThread } from "../crud";
import { create as createPost } from "../post.service/crud";
import { NodeScheduleExecuter } from "../cron.service/node-shedule/executer";

import { validateDashboardBody } from "./dashboard.validator";

import { typesToPromises } from "./typeConvertor";
import { socialConvertors } from "./socialConvertor";
import { validatePagesBySocial } from "./validatePageConvertor";
import { connectPages } from "./connectPage";

export class DashboardService {
   public static async getDashboard(ctx: IContext<IAuthState>) {
      try {
         //get all thread with dashboard mark and convert to responsable dashboard
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   public static async getPostInDashboard(ctx: IParamContext<IAuthState, IParamIdState>) {
      try {
         //get thread by id and return post from dat thread
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   public static async createPostDashboard(ctx: IContext<IAuthState>) {
      try {
         //create new thread and connect pages and post from input body:

         //before, need validate input array in ctx.request.body.pages
         //before, need validate input post object in ctx.request.body.post

         //create new thread with unique name(date maybe)
         //after, connect pages to new thread(in pages we have: socialId, pagesId[], type?)
         //after, add to thread post(+ cron executer) in post need create additional logic
         /*
          body: [post, pages]
          */

         console.log(ctx.request.body);
         const dashboard = await validateDashboardBody(ctx.request.body);

         const convertedByType = typesToPromises(dashboard.pages);

         const convertedSocials = await socialConvertors(ctx.state.user, convertedByType);
         console.log(convertedSocials);

         const validatedBySocials = await validatePagesBySocial(convertedSocials);
         console.log(validatedBySocials);

         //need validate page by social...
         /*
         const inputPages = await apiHelper.objectExistValidate(ctx.request.body.pages);
         const inputPost = await apiHelper.objectExistValidate(ctx.request.body.post);*/

         //create thread with name current dateobject
         const thread = await createThread(ctx.state.user, { name: new Date().getTime().toString() });
         console.log(thread);

         const pages = await connectPages(thread, validatedBySocials);
         console.log(pages);
         //connect pages to created thread
         //create post in dat thread
         const post = await createPost(thread, dashboard.post);
         console.log(post);

         //create job by node-schedule
         const cronExecuter = new NodeScheduleExecuter();
         await cronExecuter.create(post);

         //return pot instance
         ctx.status = 201;
         ctx.body = post;
      } catch (err) {
         //just delete thread??
         ctx.app.emit("error", err, ctx);
      }
   }
   public static async updatePostDashboard(ctx: IParamContext<IAuthState, IParamIdState>) {
      try {
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   public static async delPostDashboard(ctx: IParamContext<IAuthState, IParamIdState>) {
      try {
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
}
