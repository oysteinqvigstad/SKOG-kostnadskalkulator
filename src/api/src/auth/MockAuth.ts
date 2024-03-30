import {IAuth} from "../models/IAuth";

export class MockAuth implements IAuth {
    async verifyToken(token: string): Promise<void> {
        return Promise.resolve();
    }
}