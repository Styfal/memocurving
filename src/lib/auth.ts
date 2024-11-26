import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    User,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, collection, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
 
export const login = async (): Promise<User | null> => {
    const provider = new GoogleAuthProvider();
    // await signInWithPopup(auth, provider);
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Successfully signed in with Google:", result.user);
         // Return the signed-in user

        // Get the record from firestore that corresponds to the user that just logged in.
        const userDocRef = doc(collection(db, 'users'), result.user.uid);
        const record = await getDoc(userDocRef);

        if (!record.exists()) {
            // If the user doesn't have a record, create one
            const userData = {
                uid: result.user.uid,
                email: result.user.email,
                name: result.user.displayName,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                //Aditional Columns for Profiles
            }

            //  Create the record in the database
            await setDoc(userDocRef, userData);
            console.log("user record created with profile data: ", userData);
        } else {
            // If the user already has a record, update the last login timestamp
            await updateDoc(userDocRef, {
                lastLogin: serverTimestamp(),
            });
            console.log("user record updated with last login timestamp:");
        }
        return result.user; // Return the signed-in user

    } catch (error: any) {
        console.error("Error during login:", error.message);
        return null; // Return null if login fails
    }
};
/* 
export const listenAuthState = (dispatch: any) => {
    return onAuthStateChanged(auth, async function (user: any) {
        if (user) {
            // User is signed in.
            dispatch({
                type: "login",
                payload: {
                    user,
                },
            });
            console.log("User logged in: ", user);
        } else {
            // User is signed out.
            // ...
            dispatch({
                type: "logout",
            });
            console.log("User logged out");
        }
    });
}; */


export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
        console.log('User successfully signed out.')
        window.location.reload();
    } catch (error: any) {
        console.error('Error during logout:', error.message);
    }
};

