import * as admin from 'firebase-admin';
import {auth} from "firebase-admin";
import Auth = auth.Auth;
import {IAuth} from "../models/IAuth";

export class FirebaseAuth implements IAuth {
    #auth: Auth
    constructor() {
        this.#auth = admin.initializeApp().auth()
    }
    async verifyToken(token: string): Promise<void> {
        await this.#auth.verifyIdToken(token);
    }
}
