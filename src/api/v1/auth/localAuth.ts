import Router from "koa-router";
import { userLogic, authServise } from "../../../service";
const router = new Router();
const controller = authServise.localAuthService;

router.post("/sign-in", controller.sign_in);

router.post("/sign-up", userLogic.createMiddleware, controller.sign_up);

export { router };
