import { Context } from "koa";
import {
  FacebookUser as fbUserModel,
  User as SysUserModel
} from "../../../models";
import { getManager, Repository } from "typeorm";
import { routeServie as api } from "../../../service";
import { fbService as fb } from "../../../lib";
import { IFacebookUser, IAuthContext } from "../../../typescript";
import { omit } from "lodash";
import Router from "koa-router";
const social = new Router();

social.get("/", async (ctx: Context) => {
  //here need return all social account for current user
  //problem: we have many types : facebook, instagram, twiter...

  //CURRENT VERSION FOR FACEBOOK ONLY, idk how to write now for full with all social networks(insta, twitter e.t.c)

  const fbUserRepository: Repository<fbUserModel> = getManager().getRepository(
    fbUserModel
  );
  const fbUsers = await fbUserRepository.find({
    where: { user: <SysUserModel>ctx.state.user }
  });

  //cut access token from object, return this is to dangerous
  ctx.body = fbUsers.map(user => omit(user, "accessToken"));
});
social.get("/:id", api.validateUUIDMiddleware, async (ctx: Context) => {
  const id: string = ctx.params.id;

  const fbUserRepository: Repository<fbUserModel> = getManager().getRepository(
    fbUserModel
  );
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
social.delete("/:id", api.validateUUIDMiddleware, async (ctx: Context) => {
  const id: string = ctx.params.id; //get id from params
  const fbUserRepository: Repository<fbUserModel> = getManager().getRepository(
    fbUserModel
  );
  //find user from database
  const fbUser = await fbUserRepository.findOne({
    where: { id: id, user: <SysUserModel>ctx.state.user }
  });
  //delete user
  await fbUserRepository.remove(fbUser);
  ctx.status = 204;
});
social.post("/facebook", async (ctx: IAuthContext) => {
  const user_access_token_2h: string = ctx.request.body.token;

  //get facebook user from facebook api
  const fbApiUser: IFacebookUser = await fb.getUser(user_access_token_2h);

  const fbUserRepository: Repository<fbUserModel> = getManager().getRepository(
    fbUserModel
  );

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
    const longAccessToken = await fb.longLiveUserAccessToken(
      user_access_token_2h
    );
    //create new model for new user
    const newUser = new fbUserModel();
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

export { social };
