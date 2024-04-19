import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    // TODO: apiKey is not an access key, but they can be misused for bruteforcing attacks, etc.
    //  so we should apply stricter security rules as well
        apiKey: "AIzaSyAFSvhdW12OcOM6h7P4sfJAkn6c1YRQvWc",
        authDomain: "kostnadskalkulator.firebaseapp.com",
        projectId: "kostnadskalkulator",
        storageBucket: "kostnadskalkulator.appspot.com",
        messagingSenderId: "428871549832",
        appId: "1:428871549832:web:2f5aba37a9732921b2f03d",
    };

export const actionCodeSettings = {
    url: 'http://localhost:3000/access/confirm',
    handleCodeInApp: true
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

