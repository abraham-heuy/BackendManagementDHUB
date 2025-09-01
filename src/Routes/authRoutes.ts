import { Router } from "express";
import { AuthController } from "@app/Controllers/authController";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;
