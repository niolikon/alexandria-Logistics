import { User } from "../model/user";
export interface JWTResponse {
    status: string;
    success: string;
    user: User;
};