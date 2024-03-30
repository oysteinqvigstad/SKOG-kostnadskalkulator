import {IAuth} from "../models/IAuth";
import {AuthenticationError} from "../types/errorTypes";

export class MockAuth implements IAuth {
    async verifyToken(token: string): Promise<void> {
        if (token === "") {
            throw new AuthenticationError("Invalid authorization token")
        }
    }
}