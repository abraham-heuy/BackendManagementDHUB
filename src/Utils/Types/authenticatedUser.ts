
import { Request } from "express";
export interface AuthenticatedUser{
    clerkId: string;
    email: string;
    fullName: string;
    role: string;
    permissions: string[];

}

export interface UserRequest extends Request{
    user?:AuthenticatedUser;
    cookies: {
        access_token?: string;
    }
}