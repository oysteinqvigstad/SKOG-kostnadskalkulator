import {IAuthService} from "../interfaces/IAuthService";
import {UserData} from "../models/UserData";

/**
 * The mock authentication service for testing
 */
export class MockAuthService implements IAuthService {
    private readonly appUser: UserData    // The static user data for the mock service

    constructor() {
        this.appUser = {id: '0', email: 'Mock User'}
    }

    // Mock sending a sign in link to the user's email
    async sendSignInLink(_email: string) {
        return Promise.resolve()
    }

    // Mock the confirmation of the sign in link and return the user data
    async confirmSignIn(_emailLink: string, _email: string) {
        return this.appUser
    }

    // Mock getting the current authentication status of the user through callback
    getAuthStatus(callback: (user: UserData | null) => void) {
        return callback(this.appUser)
    }

    // Mock checking if the URL type is a sign in link
    isSignInLink(_url: string) {
        return true
    }

    // Mock getting the email address that was stored in the local storage
    getConfirmEmail(): string | null {
        return this.appUser.email
    }

    // Deny sign out for the mock service
    signOut() {
        return Promise.reject("User switching is not implemented in Mock Auth Service. Change dependency injection in code to use the real authentication service. If you see this error in production, please notify the administrator")
    }

    // Mock getting the auth token
    getToken() {
        return Promise.resolve("{ Mock Token }")
    }
}