import express, { Router } from "express";
import { protect } from "@app/middlewares/RBAC/protect";
import { adminGuard } from "@app/middlewares/RBAC/roleGuard";
import { UserController } from "./userController";

export class UserRoutes {
    public router: Router;
    private userController: UserController;

    constructor() {
        this.router = express.Router();
        this.userController = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/",protect,adminGuard, this.userController.fetchUsers);
        this.router.get("/:id",protect,adminGuard,this.userController.fetchUserById);
        this.router.put("/:id",protect,adminGuard,this.userController.updateUser);
        this.router.patch("/self", protect,adminGuard, this.userController.patchAdminDetails);
        this.router.delete("/:id",protect,adminGuard,this.userController.removeUser);
    }
}

export default new UserRoutes().router;
