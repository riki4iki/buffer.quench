import Router from "koa-router";
import { Repository, getManager } from "typeorm";
import { fbService as fb } from "../../../../lib";
import { IContext, IAuthState, IFacebookUser, IParamContext, IParamIdState, IFacebookPage } from "../../../../types";
import { omit } from "lodash";
import { routeServie as api } from "../../../../service";
import { FacebookUser as FbUserModel, User as SysUserModel, FacebookPage } from "../../../../models";
const fbRouter = new Router();

fbRouter.get("/", async (ctx: IContext<IAuthState>) => {
   const fbUserRepository: Repository<FbUserModel> = getManager().getRepository(FbUserModel);
   const fbUsers = await fbUserRepository.find({
      where: { user: <SysUserModel>ctx.state.user }
   });

   //cut access token from object, return this is to dangerous
   ctx.body = fbUsers.map(user => omit(user, "accessToken"));
});
fbRouter.post("/", async (ctx: IContext<IAuthState>) => {
   const user_access_token_2h: string = ctx.request.body.token;

   //get facebook user from facebook api
   const fbApiUser: IFacebookUser = await fb.getUser(user_access_token_2h);

   const fbUserRepository: Repository<FbUserModel> = getManager().getRepository(FbUserModel);

   let fbLocalUser = await fbUserRepository.findOne({
      fbId: fbApiUser.id,
      user: <SysUserModel>ctx.state.user
   });
   if (fbLocalUser) {
      //user exist and coonect with cuurent user
      ctx.status = 400;
      ctx.body = "exist";
   } else {
      //generate long live access token for new user
      const longAccessToken = await fb.longLiveUserAccessToken(user_access_token_2h);
      //create new model for new user
      const newUser = new FbUserModel();
      newUser.fbId = fbApiUser.id;
      newUser.accessToken = longAccessToken.access_token;
      newUser.user = ctx.state.user;
      //save that
      fbLocalUser = await fbUserRepository.save(newUser);
      ctx.status = 200;
      //return api id, facebookAPI id
      ctx.body = {
         id: fbLocalUser.id,
         facebook_id: fbLocalUser.fbId
      };
   }
});
fbRouter.post("/page", async (ctx: IContext<IAuthState>) => {
   const user_access_token_token_2h: string = ctx.request.body.token; //input facebook user access token with 2 h live

   const fbUser: IFacebookUser = await fb.getUser(user_access_token_token_2h); // get user from facebook by access token from client side
   const fbUserRepository: Repository<FbUserModel> = getManager().getRepository(
      // create facebook user repository
      FbUserModel
   );
   let localFbUser = await fbUserRepository.findOne({
      fbId: fbUser.id,
      user: <SysUserModel>ctx.state.user
   }); //find exist facebook user in database with all system users which links with that facebook user
   if (!localFbUser) {
      // if not exist need to create
      // new user in system, need create a new raw in db
      const fbUserModel = new FbUserModel();
      fbUserModel.fbId = fbUser.id;
      fbUserModel.accessToken = user_access_token_token_2h;
      fbUserModel.user = <SysUserModel>ctx.state.user;

      localFbUser = await fbUserRepository.save(fbUserModel);
   }

   const longUserToken = await fb.longLiveUserAccessToken(
      // generate access token for 60 days
      user_access_token_token_2h
   );
   localFbUser.accessToken = longUserToken.access_token;
   localFbUser = await fbUserRepository.save(localFbUser); //save new long acess token to database

   const pages: Array<IFacebookPage> = await fb.longLiveAccounts(longUserToken.access_token, localFbUser.fbId);

   const pageRepository: Repository<FacebookPage> = getManager().getRepository(FacebookPage);

   const savedPages = await Promise.all(
      pages.map(async page => {
         const dbPage = await pageRepository.findOne({
            fbUser: localFbUser,
            fbId: page.id
         });
         if (!dbPage) {
            console.log("new page");
            const pageModel = new FacebookPage();
            pageModel.fbUser = localFbUser;
            pageModel.accessToken = page.access_token;
            pageModel.fbId = page.id;
            pageModel.source = page.cover.source;
            pageModel.category = page.category;
            pageModel.tasks = page.tasks;
            pageModel.name = page.name;

            return await pageRepository.save(pageModel);
         } else {
            return dbPage;
         }
      })
   );
   ctx.body = savedPages.map(page => omit(page, ["accessToken", "fbUser"])); // return pages for user
});
fbRouter.get("/:id", api.validateUUIDMiddleware, async (ctx: IParamContext<IAuthState, IParamIdState>) => {
   const id: string = ctx.params.id;

   const fbUserRepository: Repository<FbUserModel> = getManager().getRepository(FbUserModel);
   const fbUser = await fbUserRepository.findOne({
      where: { id: id, user: <SysUserModel>ctx.state.user }
   });
   if (!fbUser) {
      //there is no users in database
      ctx.status = 204;
   } else {
      ctx.status = 200;
      ctx.body = omit(fbUser, "accessToken"); //cut access token from object
   }
});
fbRouter.delete("/:id", api.validateUUIDMiddleware, async (ctx: IParamContext<IAuthState, IParamIdState>) => {
   const id: string = ctx.params.id; //get id from params
   const fbUserRepository: Repository<FbUserModel> = getManager().getRepository(FbUserModel);
   //find user from database
   const fbUser = await fbUserRepository.findOne({
      where: { id: id, user: <SysUserModel>ctx.state.user }
   });
   //delete user
   await fbUserRepository.remove(fbUser);
   ctx.status = 204;
});
export { fbRouter };
