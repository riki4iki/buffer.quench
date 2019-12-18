import Router from "koa-router";
const router = new Router();
import { userLogic } from "../../../service";
import { authServise as AuthService } from "../../../service";

const accounts: Router = require("./page");
import { social } from "./social";
import { thread } from "./thread";

router.use(
  "/page",
  AuthService.checkSession,
  userLogic.getCurrentUserMiddleware,
  accounts.routes()
);

router.use(
  "/social",
  AuthService.checkSession,
  userLogic.getCurrentUserMiddleware,
  social.routes()
);

router.use(
  "/thread",
  AuthService.checkSession,
  userLogic.getCurrentUserMiddleware,
  thread.routes()
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
