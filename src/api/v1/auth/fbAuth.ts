import { Context } from "koa";
import Router from "koa-router";
import { FacebookUser as FbUser, User as SystemUser } from "../../../models";
import { jwtService as jwt, fbService as fb } from "../../../lib";
import { Repository, getManager } from "typeorm";
import { IFacebookUser } from "../../../typescript";
const router = new Router();

//facebook authenticete by facebook access token
router.post("/sign-in", async (ctx: Context) => {
  /* //Inpute data: access token from facebook auth dialog, must find user by input token, return jwt
  const user_access_token_2h = ctx.request.body.token;
  //get from facebook userId
  const fbUser: IFacebookUser = await fb.getUser(user_access_token_2h);
  //create facebook user repository
  const fbUserRepository: Repository<FbUser> = getManager().getRepository(
    FbUser
  );
  //find facebook user in system
  const localFbUser = await fbUserRepository.findOne(fbUser.id);
  console.log(localFbUser);
  if (!localFbUser) {
    // this facebook account dont connected to any main user
    ctx.status = 401;
    ctx.body = "No accounts in system with that facebook user";
  } else {
    // find users with connected with dat facebook acc
    const sysUserRepository: Repository<SystemUser> = getManager().getRepository(
      SystemUser
    );
    const sysUsers: Array<SystemUser> = await sysUserRepository.find({
      facebookUser: localFbUser
    });
    console.log(sysUsers);
    if (sysUsers.length > 1) {
      //if target facebook account has been connected to two or more system users, system dont know which user is logging in...
      ctx.status = 401;
      ctx.body = "Target facebook account belongs two or more users...";
    } else {
      const user = sysUsers[0];
      //create jwt access token and refresh token for authed user, update session in database
      const pair = await jwt.createPair(user);
      ctx.status = 200;
      ctx.body = pair;
    }
  }*/
});

export = router;
