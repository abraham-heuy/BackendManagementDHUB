import { Router } from "express";
import { AuthController } from "@app/Controllers/authController";
import { protect } from "@app/middlewares/RBAC/protect";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", protect,authController.getMe)
router.post("/forgot-password", authController.forgotPassword)
export default router;
