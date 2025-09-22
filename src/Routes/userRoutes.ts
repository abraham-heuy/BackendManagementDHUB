import express, { Router } from "express";
import { UserController } from "@app/Controllers/userController";

export class UserRoutes {
    public router: Router;
    private userController: UserController;

    constructor() {
        this.router = express.Router();
        this.userController = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/", this.userController.fetchUsers);
        this.router.get("/:id", this.userController.fetchUserById);
        this.router.put("/:id", this.userController.updateUser);
        this.router.delete("/:id", this.userController.removeUser);
    }
}

export default new UserRoutes().router;
