import {sendSignInLinkToEmail, ActionCodeSettings, isSignInWithEmailLink, User, signInWithEmailLink, Auth} from "firebase/auth";
import {auth, actionCodeSettings } from "../firebase-config";
import {IAuthService} from "../interfaces/IAuthService";
import {UserData} from "../models/UserData";

/**
 * The authentication service for Firebase
 */
export class FirebaseAuthService implements IAuthService {
    private readonly auth: Auth                     // The authentication object
    private readonly settings: ActionCodeSettings   // The settings for authentication process
    private readonly storedEmailKey: string         // The local storage key name for the email address

    constructor() {
        this.auth = auth
        this.settings = actionCodeSettings
        this.storedEmailKey = "emailForSignIn"
    }

    // Send a sign in link to the user's email
    async sendSignInLink(email: string) {
        await sendSignInLinkToEmail(this.auth, email, this.settings)
        window.localStorage.setItem(this.storedEmailKey, email)
    }

    // Confirm the validity of sign in link of the user and generate the auth token
    async confirmSignIn(emailLink: string, email: string) {
        const result = await signInWithEmailLink(this.auth, email, emailLink)
        window.localStorage.removeItem(this.storedEmailKey)
        return {id: result.user.uid, email: result.user.email ?? ""}
    }

    // Get the current authentication status of the user through callback
    getAuthStatus(callback: (user: UserData | null) => void): void {
        this.auth.onAuthStateChanged((user: User | null) => {
            return user ? callback({id: user.uid, email: user.email ?? ""}) : callback(null)
        })
    }

    // Check if the URL type is a sign in link
    isSignInLink(url: string) {
        return isSignInWithEmailLink(this.auth, url)
    }

    // Get the email address that was stored in the local storage
    getConfirmEmail(): string | null {
        return window.localStorage.getItem(this.storedEmailKey)
    }

    // Sign out the user
    async signOut() {
        return this.auth.signOut()
    }
}