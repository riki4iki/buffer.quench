import Router from "koa-router";
import { userLogic, localAuthService as controller } from "../../../service";
const router = new Router();

router.post("/sign-in", controller.signIn);

router.post("/sign-up", userLogic.createMiddleware, controller.signUp);

export { router };
