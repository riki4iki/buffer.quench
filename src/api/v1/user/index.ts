import Router from "koa-router";
const router = new Router();
import { userLogic } from "../../../service";
import AuthService from "../../../lib/auth";

const accounts: Router = require("./page");

router.use(
  "/page",
  AuthService.checkSession,
  userLogic.getCurrentUserMiddleware,
  accounts.routes()
);

router.get(
  "/",
  AuthService.checkSession,
  userLogic.getCurrentUserMiddleware,
  userLogic.getCurrentUserEndPoint
);
router.put(
  "/update",
  AuthService.checkSession,
  userLogic.getCurrentUserMiddleware,
  userLogic.updateCurrnetUserEndPoint
);

router.delete(
  "/delete",
  AuthService.checkSession,
  userLogic.getCurrentUserMiddleware,
  userLogic.deleteCurrentUserEndPoint
);

export = router;
