import express, { Router } from "express";
import {StudentProfileController} from "@app/Controllers/userProfileController"

export class ProfileRoutes {
    public router: Router;
    private profileController: StudentProfileController;

    constructor(){
        this.router = express.Router();
        this.profileController = new StudentProfileController();
        this.initializedRoutes()
    }

    private initializedRoutes(): void{
        this.router.post("/create", this.profileController.create)
        this.router.get("/", this.profileController.getAll)
        this.router.get("/user/:id", this.profileController.getByUserId)
        this.router.get("/profile/:id", this.profileController.getOne)
        this.router.get("/me/:id", this.profileController.getMine)
        this.router.put("/:id", this.profileController.update)
        this.router.delete("/:id", this.profileController.delete)
    }
}

export default new ProfileRoutes().router