import { auth, provider, signInWithPopup } from "../firebase";
import { getFirestore, doc, getDoc, setDoc ,collection,getDocs} from "firebase/firestore";

const db = getFirestore();
export const fetchAllUsersdata = async () => {
  const usersRef = collection(db, "users"); // Firestore users collection
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Sign in with Google and store user in Firestore
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = {
      uid: result.user.uid,
      email: result.user.email,
      name: result.user.displayName,
      photo: result.user.photoURL,
    };

    // Check if user exists in Firestore
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Add new user to Firestore if not exists
      await setDoc(userRef, user);
    }

    return user;
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    throw error;
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await auth.signOut();
    return true;
  } catch (error) {
    console.error("Error during Sign-Out:", error);
    throw error;
  }
};

// Check if user is already signed in
export const checkAuthStatus = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe(); // Unsubscribe once we know the status
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
        };
        resolve(userData);
      } else {
        resolve(null);
      }
    }, reject);
  });
};
