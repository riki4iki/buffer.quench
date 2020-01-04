import Router from "koa-router";
import { authServise } from "../../../service";

const controller = authServise.facebookAuthService;
const router = new Router();

//facebook authenticete by facebook access token
router.post("/sign-in", controller.sign_in);

export { router };
