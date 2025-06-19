import React, { ReactNode, useState, useEffect, createContext, useContext } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  sendPasswordResetEmail
} from "firebase/auth";
import { FIREBASE_AUTH as auth, FIREBASE_GOOGLE_PROVIDER as provider} from "@/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  createUser: (email: string, password: string, confirmPassword: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const idToken = await user.getIdToken();
        setToken(idToken);
      } else {
        setUser(null);
        setToken(null);
      }
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    
    // Validate email and password
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
    // Try signing in
    try {
      await signInWithEmailAndPassword(auth, email, password);

    } catch (error) {
      console.error("Sign in error:", error);
      throw error; 
    }

  };

  // Create User
  const createUser = async (email: string, password: string, confirmPassword: string) => {
    // Validate email and password
    if (!email || !password || !confirmPassword) {
      throw new Error("Email and password are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Try creating user
    try {
      await createUserWithEmailAndPassword(auth, email, password);

    } catch (error) {
      console.error("Create user error:", error);
      throw error;
    }
  };

  // Function to sign out the user
  const signOutUser = async () => {
    console.log("Signing out user:", user?.email);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    if (!email) {
      throw new Error("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }
  return (
    <AuthContext.Provider value={{ user, token, signIn, createUser, signOutUser, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
