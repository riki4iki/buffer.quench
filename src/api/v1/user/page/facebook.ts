import { Context } from "koa";
import Router from "koa-router";
const facebookRouter = new Router();

import {
  FacebookUser as FbUser,
  FacebookPage as FbPage
} from "../../../../models";
import { Repository, getManager } from "typeorm";
import { fbService as fb } from "../../../../lib";
import { IFacebookPage, IFacebookUser } from "../../../../typescript";

facebookRouter.get("/", async (ctx: Context) => {
  const user_access_token: string = ctx.request.body.user_access_token;

  const pages: Array<IFacebookPage> = await fb.accounts(user_access_token);

  ctx.body = pages;
});

facebookRouter.post("/", async (ctx: Context) => {
  const user_access_token_token_2h: string = ctx.request.body.token; //input facebook user access token with 2 h live

  const fbUser: IFacebookUser = await fb.getUser(user_access_token_token_2h); // get user from facebook by access token from client side
  const fbUserRepository: Repository<FbUser> = getManager().getRepository(
    // create facebook user repository
    FbUser
  );
  let localFbUser = await fbUserRepository.findOne(fbUser.id); //find exist facebook user in databes
  if (!localFbUser) {
    // if not exist need to create
    // new user in system, need create a new raw in db
    const fbUserModel = new FbUser();
    fbUserModel.id = fbUser.id;
    fbUserModel.email = fbUser.email;
    fbUserModel.name = fbUser.name;
    fbUserModel.accessToken = user_access_token_token_2h;
    fbUserModel.user = ctx.state.user;

    localFbUser = await fbUserRepository.save(fbUserModel);
  }

  const longUserToken = await fb.longLiveUserAccessToken(
    // generate access token for 60 days
    user_access_token_token_2h
  );
  localFbUser.accessToken = longUserToken.access_token;
  localFbUser = await fbUserRepository.save(localFbUser); //save new long acess token to database

  const pages: Array<IFacebookPage> = await fb.longLiveAccounts(
    //get user pages from facebook
    longUserToken.access_token,
    localFbUser.id
  );
  const fbPageRepository: Repository<FbPage> = getManager().getRepository(
    FbPage
  );

  const prom = pages.map(async page => {
    const localPage = await fbPageRepository.findOne(page.id);
    if (!localPage) {
      console.log("new page");
      const pageModel = new FbPage();
      pageModel.name = page.name;
      pageModel.id = page.id;
      pageModel.accessToken = page.access_token;
      pageModel.tasks = page.tasks;
      pageModel.fbUser = localFbUser;

      await fbPageRepository.save(pageModel);
    }
  });
  Promise.all(prom);
  ctx.body = pages; // return pages for user
});
facebookRouter.delete("/", async (ctx: Context) => {
  ctx.body = "remove facebook account from current user";
});
export = facebookRouter;
