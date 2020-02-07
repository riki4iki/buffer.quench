import { IContext, IAuthState, IParamContext, IParamIdState } from "../../../types/koa";
import { create as createThread } from "../crud";
import { create as createPost } from "../post.service/crud";
import { NodeScheduleExecuter } from "../cron.service/node-shedule/executer";
import apiHelper from "../../api";

import { connectPages } from "./pageConnection";

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
         const inputPages = await apiHelper.objectExistValidate(ctx.request.body.pages);
         const inputPost = await apiHelper.objectExistValidate(ctx.request.body.post);
         const pages = await apiHelper.StringToArray(ctx.request.body.pages);
         //create thread with name current date
         const thread = await createThread(ctx.state.user, { name: new Date().getTime().toString() });
         console.log(thread);
         //connect pages to created thread
         await connectPages(ctx.state.user, thread, ctx.request.body.pages);
         console.log(pages);
         //create post in dat thread
         const post = await createPost(thread, ctx.request.body.post);
         console.log(post);

         //create job by node-schedule
         const cronExecuter = new NodeScheduleExecuter();
         await cronExecuter.create(post);

         //return pot instance
         ctx.status = 201;
         ctx.body = post;
      } catch (err) {
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
