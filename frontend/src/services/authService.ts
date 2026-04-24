import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const authService = {
  async login(email: string, pass: string) {
    const auth = getAuth();
    return await signInWithEmailAndPassword(auth, email, pass);
  },

  async loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  },

  async logout() {
    const auth = getAuth();
    await signOut(auth);
  },
};
