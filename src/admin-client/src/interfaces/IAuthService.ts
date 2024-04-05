import {UserData} from "../models/UserData";

export interface IAuthService {
    // Send a sign in link to the user's email
    sendSignInLink: (email: string) => Promise<void>
    // Confirm the validity of sign in link of the user and generate the auth token
    confirmSignIn: (emailLink: string, email: string) => Promise<UserData>
    // Get the current authentication status of the user through callback
    getAuthStatus(callback: (user: UserData | null) => void): void
    // Get the email address that was stored in the local storage
    getConfirmEmail(): string | null
    // Check if the URL type is a sign in link
    isSignInLink(url: string): boolean
    // Sign out the user
    signOut(): Promise<void>
    // Get the auth token
    getToken(): Promise<string>
}