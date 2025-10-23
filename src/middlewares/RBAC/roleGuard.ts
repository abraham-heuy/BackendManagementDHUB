//check the roles for the authenticated user? 
//adds another layer of protection to the endpoints thanks to the RBAC achitecture.

import { UserRequest } from "@app/Utils/Types/authenticatedUser"
import { NextFunction, Response} from "express"

export const roleGuard = (allowedRoles: string[]) => {
    return (req: UserRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role.name)) {
            res.status(403).json({
                message: "Access denied: do not have the facilities for that men"
            });
            return;
        }
        next();
    };
};

export const adminGuard =  roleGuard(["admin"]); //full control
export const studentGuard =  roleGuard(["mentee"]); //mentee-based actions
export const mentorGuard =  roleGuard(["mentor"]); //only relevant roles but limited
export const adminorStaffGuard =  roleGuard(["admin", "mentor"]); //roles that require either a staff member or an admin
export const  adminorStudents = roleGuard((["admin", "mentee"]));  //some routes can be accessed by both admins an students! 

 