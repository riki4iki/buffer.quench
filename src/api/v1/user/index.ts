import Router from "koa-router";
const router = new Router();
import { userLogic } from "../../../service";
import AuthService from "../../../lib/auth";

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
