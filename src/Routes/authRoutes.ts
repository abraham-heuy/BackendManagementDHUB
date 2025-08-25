import express from "express";
import { loginOrRegisterUser, getProfile } from "@app/Controllers/authController";
import { validateClerkToken } from "@app/middlewares/auth/validateToken";

const router = express.Router();

router.post("/login", validateClerkToken, loginOrRegisterUser);
router.get("/me", validateClerkToken, getProfile);

export default router;
