import { Router } from "express";

import { CONFIGS } from "@/configs";
import auth from "@/middlewares/auth.middleware";
import UserCtrl from "@/controllers/v1/user.controller";

const router: Router = Router();

router.get("/me", auth(CONFIGS.APP_ROLES.USER), UserCtrl.getCurrentUser);

export default router;
