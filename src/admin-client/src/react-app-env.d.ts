/// <reference types="react-scripts" />
import {RecaptchaVerifier} from "firebase/auth";

declare global {
    interface Window {
        recatchaVerifier: RecaptchaVerifier
    }
}