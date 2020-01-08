import Router from "koa-router";
import { Repository, getManager } from "typeorm";
import { fbService as fb } from "../../../../lib";
import { IContext, IAuthState, IFacebookUser, IParamContext, IParamIdState, IFacebookPage } from "../../../../types";
import { omit } from "lodash";
import { routeServie as api, facebookSocialService as controller } from "../../../../service";
import { FacebookUser as FbUserModel, User as SysUserModel, FacebookPage } from "../../../../models";
const fbRouter = new Router();

fbRouter.get("/", controller.facebookUsersEndPoint);
fbRouter.post("/", controller.facebookUserConnectEndPoint);
fbRouter.get("/:id/page", api.validateUUIDMiddleware, controller.facebookUserByIdMiddleware, controller.facebookPageGettingEndPoint);
fbRouter.get("/:id", api.validateUUIDMiddleware, controller.facebookUserByIdEndPoint);
fbRouter.del("/:id", api.validateUUIDMiddleware, controller.facebookUserDisconnectEndPoint);
export { fbRouter };
