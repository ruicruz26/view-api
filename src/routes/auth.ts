import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();

router.get("/api/auth/:username/:password", AuthController.login);
router.post("/api/auth/register", AuthController.register);
router.post("/api/auth/newPassword", AuthController.newPassword);
router.post("/api/auth/resetPassword", AuthController.resetPassword);

export default router;