

//check the roles for the authenticated user? 

import { UserRequest } from "@app/Utils/Types/authenticatedUser"
import { NextFunction, Response} from "express"

export const roleGuard = (allowedRoles: string[])=>{
    return (req: UserRequest, res: Response, next:NextFunction)=>{
        if(!req.user || !allowedRoles.includes(req.user.role)){
            res.status(403).json({
                message:  "Access denied: do not the facilities for that mehn"
            })
            return
        }
        next();
    }
}

export const adminGuard =  roleGuard(["admin"]); //full control
export const staffGuard =  roleGuard(["staff"]);  //most control but limited to some roles
export const studentGuard =  roleGuard(["student"]); //student-based actions
export const mentorGuard =  roleGuard(["mentor"]); //only relevant roles but limited
export const adminorStaffGuard =  roleGuard(["admin", "staff"]); //roles that require either a staff member or an admin
