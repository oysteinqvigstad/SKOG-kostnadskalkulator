import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    // TODO: apiKey is not an access key, but they can be misused for bruteforcing attacks, etc.
    //  so we should apply stricter security rules as well
    apiKey: "AIzaSyDqqH0vgnbhXK7t8ia7um9Tx3TfLwkCAcg",
    authDomain: "modern-heading-411109.firebaseapp.com",
    projectId: "modern-heading-411109",
    storageBucket: "modern-heading-411109.appspot.com",
    messagingSenderId: "64157141840",
    appId: "1:64157141840:web:2a6f5b84a0c412d23c7a55",
    measurementId: "G-7N0MMDJ14J"
}

export const actionCodeSettings = {
    url: 'http://localhost:3000/access/confirm',
    handleCodeInApp: true
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

