 //this is to check for the actions on the resources 
 //example: create,read, update, delete.

import { UserRequest } from "@app/Utils/Types/authenticatedUser"
import { NextFunction, Response} from "express"


 export const authorize  = (permission: string) =>{
    return (req: UserRequest, res: Response, next: NextFunction)=>{
        if(!req.user?.permissions?.includes(permission)){
            res.status(403).json({
                message: "Forbidden: Insufficient rights!"
            }) 
            return
        }
        next();
    }
    
 }

 //use it as 
 // authorize('read:profie')