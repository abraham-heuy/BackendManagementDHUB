 import { fetchUserById, fetchUsers, removeUser, updateUserProfile } from "@app/Controllers/userController";
import express from "express"

 const user = express.Router();
 
 user.get("/", fetchUsers)
 user.get("/:id", fetchUserById)
 user.put("/:id", updateUserProfile)
 user.delete("/:id", removeUser)

 export default user; 