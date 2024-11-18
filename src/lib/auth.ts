import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export const login = async (): Promise<User | null> => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Successfully signed in with Google:", result.user);
        return result.user; // Return the signed-in user
    } catch (error: any) {
        console.error("Error during login:", error.message);
        return null; // Return null if login fails
    }
};

export const listenAuthState = (dispatch: any) => {
    return onAuthStateChanged(auth, function (user: any) {
        if (user) {
            // User is signed in.
            dispatch({
                type: "login",
                payload: {
                    user,
                },
            });
        } else {
            // User is signed out.
            // ...
            dispatch({
                type: "logout",
            });
        }
    });
};


export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
        console.log('User successfully signed out.')
        window.location.reload();
    } catch (error: any) {
        console.error('Error during logout:', error.message);
    }
};

