import { IContext, IAuthState, IParamContext, IParamIdState } from "../../../types/koa";
import { create as createThread } from "../crud";
import { create as createPost, update as updatePost } from "../post.service/crud";

import { NodeScheduleExecuter } from "../cron.service/node-shedule/executer";

import { validateDashboardBody } from "./dashboard.validator";

import { connectPages, socialConvertors, typesToPromises, validatePagesBySocial } from "./connectionService";
import { selectDashboardedThreadWithPost, selectAllDashboardedThreadsWithPost } from "./getterService";
import { findThreadById, convertPages, difference, disconnectPages } from "./updateService";

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
   public static async getPostInDashboard(ctx: IParamContext<IAuthState, IParamIdState>) {
      try {
         //get thread by id and return post from dat thread
         const response = await selectDashboardedThreadWithPost(ctx.state.user, ctx.params.id);
         ctx.status = 200;
         ctx.body = response;
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
         const respose = {
            id: thread.id,
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
         const dashboard = await validateDashboardBody(ctx.request.body);

         const inputPagesConvertedByType = typesToPromises(dashboard.pages);

         const convertedSocials = await socialConvertors(ctx.state.user, inputPagesConvertedByType);
         console.log(convertedSocials);

         const pagesValidatedBySocials = await validatePagesBySocial(convertedSocials);
         console.log(pagesValidatedBySocials);

         const converted = await convertPages(thread, thread.page);
         console.log(converted);

         const { toConnect, toDisconnect } = await difference(converted, pagesValidatedBySocials);
         console.log(toConnect);
         console.log(toDisconnect);
         const connectedPages = await connectPages(thread, toConnect);
         console.log(connectedPages);

         const disconnectedPages = await disconnectPages(thread, toDisconnect);
         console.log(disconnectedPages);

         const [post] = await thread.posts;
         console.log(post);
         console.log(thread);
         const updatedPost = await updatePost(thread, post.id, dashboard.post);
         console.log(updatedPost);

         const cronExecuter = new NodeScheduleExecuter();
         await cronExecuter.update(updatedPost);
         const response = { id: thread.id };
         ctx.status = 200;
         ctx.body = response;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
}
