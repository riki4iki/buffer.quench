import Router from "koa-router";
import { userLogic, localAuthService as controller } from "../../../service";
const router = new Router();

router.post("/sign-in", controller.sign_in);

router.post("/sign-up", userLogic.createMiddleware, controller.sign_up);

export { router };
