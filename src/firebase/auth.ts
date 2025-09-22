import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { auth, googleProvider } from "./config";
import { type AuthFnType } from "../types/auth";

export const signInWithEmail = ({ email, password }: AuthFnType) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async ({
  email,
  password,
  name,
  avatarURL,
}: AuthFnType) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (name && avatarURL) {
    await updateProfile(userCredential.user, {
      displayName: name,
      photoURL: avatarURL,
    });
  }

  return userCredential;
};

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export async function getIdTokenOrThrow(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  // false = return cached token or a refreshed one if needed
  return user.getIdToken(false);
}

export const signOut = () => {
  return auth.signOut();
};
