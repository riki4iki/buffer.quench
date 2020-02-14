import { IContext, IAuthState, IParamContext, IParamIdState } from "types/koa";

import { validateRequestBody } from "./validator";

import { createThreadAndConnect } from "./connectionService";
import { createPost, updatePost } from "./postService";
import { updateThreadPages } from "./updateService";

import { selectAllDashboardedThreadsWithPost, findThreadById } from "./getterService";

export class DashboardService {
   public static async getDashboard(ctx: IContext<IAuthState>) {
      try {
         const response = await selectAllDashboardedThreadsWithPost(ctx.state.user);
         console.log(response);
         ctx.status = 200;
         ctx.body = response;
         //get all thread with dashboard mark and convert to responsable dashboard
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
         const dashboard = await validateRequestBody(ctx.request.body);
         const thread = await createThreadAndConnect(ctx.state.user, dashboard.pages);

         const postedThread = await createPost(thread, dashboard.post);

         //return pot instance
         const respose = {
            id: postedThread.id,
         };
         ctx.status = 201;
         ctx.body = respose;
      } catch (err) {
         //just delete thread??
         ctx.app.emit("error", err, ctx);
      }
   }
   public static async updatePostDashboard(ctx: IParamContext<IAuthState, IParamIdState>) {
      try {
         //need check does thread is exist
         const thread = await findThreadById(ctx.state.user, ctx.params.id);
         //thread exist, validate input body
         const dashboard = await validateRequestBody(ctx.request.body);

         const updatedThreadPages = await updateThreadPages(ctx.state.user, thread, dashboard.pages);

         const [post] = await thread.posts;

         const updateThreadPost = await updatePost(updatedThreadPages, post, dashboard.post);

         const response = { id: updateThreadPost.id };
         ctx.status = 200;
         ctx.body = response;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
}
