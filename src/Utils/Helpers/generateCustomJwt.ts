import { PermissionPayload } from "@app/Utils/Types/permissionPayload";
import Jwt from "jsonwebtoken";



export const generateCustomJwt = (payload: PermissionPayload)=>{
    const jwtSecret = process.env.JWT_SECRET;

    if(!jwtSecret){
        throw new Error("Undefined secret, check your configuration!")
    }

    try{
        const token = Jwt.sign(payload, jwtSecret,{
            expiresIn: "1h", //expires after one hour 
        })
        return token
    }catch(error){
        console.error("Error generating custom  JWT:", error)
        throw new Error("Error generating custom permission token")
    }
}