import Router from "koa-router";
import { facebookAuthService as controller } from "../../../service";

const router = new Router();

//facebook authenticete by facebook access token
router.post("/sign-in", controller.sign_in);

export { router };
