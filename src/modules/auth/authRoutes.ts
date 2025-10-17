import { Router } from "express";
import { AuthController } from "./authController";
import { adminGuard } from "@app/middlewares/RBAC/roleGuard";
import { protect } from "@app/middlewares/RBAC/protect";

const router = Router();
const authController = new AuthController();

router.post("/register",
    protect,adminGuard,
    authController.register);//admin controls the registration of all the students when they're approved.
    // hence the checking of the role
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", protect,authController.getMe) //check the authenticated user. Helps us to protect the components in the frontend!
router.post("/forgot-password", authController.forgotPassword)
export default router;
