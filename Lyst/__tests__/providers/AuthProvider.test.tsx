import React, { act } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "../../providers/AuthProvider";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

// Mock Firebase auth methods
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

// Mock Firebase config
jest.mock("../../FirebaseConfig", () => ({
  FIREBASE_AUTH: {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue("mock-token"),
    },
  },
}));

describe("AuthProvider", () => {
  let authStateCallback: (user: any) => void;

  beforeEach(() => {
    jest.clearAllMocks();

    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      authStateCallback = callback;
      callback(null);
      return jest.fn();
    });

    // Mock methods
    (signInWithEmailAndPassword as jest.Mock).mockImplementation(
      async (auth, email, password) => {
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

        return {
          user: {
            email,
            getIdToken: jest.fn().mockResolvedValue("mock-token"),
          },
        };
      }
    );

    (createUserWithEmailAndPassword as jest.Mock).mockImplementation(
      async (auth, email, password) => {
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

        return {
          user: {
            email,
            getIdToken: jest.fn().mockResolvedValue("mock-token"),
          },
        };
      }
    );

    (signOut as jest.Mock).mockResolvedValue(undefined);
    (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);
  });

  // Initial state tests
  describe("Initial State", () => {
    it("initialize with null user and token", () => {
      let authContext: any;

      const TestWrapper = () => {
        authContext = useAuth();
        return <View />;
      };

      render(
        <AuthProvider>
          <TestWrapper />
        </AuthProvider>
      );

      expect(authContext.user).toBe(null);
      expect(authContext.token).toBe(null);
    });
  });

  // Sign In tests
  describe("Sign In", () => {
    it("successfully sign in with valid email amd password", async () => {
      let authContext: any;

      const TestWrapper = () => {
        authContext = useAuth();
        return <View />;
      };

      render(
        <AuthProvider>
          <TestWrapper />
        </AuthProvider>
      );

      await expect(
        authContext.signIn("test@gmail.com", "qwerty")
      ).resolves.not.toThrow();
    });

    it("reject invalid empty email", async () => {
      let authContext: any;

      const TestWrapper = () => {
        authContext = useAuth();
        return <View />;
      };

      render(
        <AuthProvider>
          <TestWrapper />
        </AuthProvider>
      );

      await expect(authContext.signIn("", "qwerty")).rejects.toThrow(
        "Email and password are required"
      );
    });

    it("reject invalid bad email", async () => {
      let authContext: any;

      const TestWrapper = () => {
        authContext = useAuth();
        return <View />;
      };

      render(
        <AuthProvider>
          <TestWrapper />
        </AuthProvider>
      );

      await expect(authContext.signIn("test", "qwerty")).rejects.toThrow(
        "Invalid email format"
      );
    });

    it("reject empty password", async () => {
      let authContext: any;

      const TestWrapper = () => {
        authContext = useAuth();
        return <View />;
      };

      render(
        <AuthProvider>
          <TestWrapper />
        </AuthProvider>
      );

      await expect(authContext.signIn("test@gmail.com", "")).rejects.toThrow(
        "Email and password are required"
      );
    });

    it("reject bad password", async () => {
      let authContext: any;

      const TestWrapper = () => {
        authContext = useAuth();
        return <View />;
      };

      render(
        <AuthProvider>
          <TestWrapper />
        </AuthProvider>
      );

      await expect(authContext.signIn("test@gmail.com", "abc")).rejects.toThrow(
        "Password must be at least 6 characters long"
      );
    });
  });

  // User Creation tests
  describe("User Creation", () => {
    it("create user with matching passwords", async () => {
      let authContext: any;

      const TestWrapper = () => {
        authContext = useAuth();
        return <View />;
      };

      render(
        <AuthProvider>
          <TestWrapper />
        </AuthProvider>
      );

      // Test that createUser doesn't throw an error for valid inputs
      await expect(
        authContext.createUser("test@gmail.com", "qwerty", "qwerty")
      ).resolves.not.toThrow();
    });

    it("reject bad password", async () => {
      let authContext: any;

      const TestWrapper = () => {
        authContext = useAuth();
        return <View />;
      };

      render(
        <AuthProvider>
          <TestWrapper />
        </AuthProvider>
      );

      await expect(
        authContext.createUser("test@gmail.com", "abc", "abc")
      ).rejects.toThrow("Password must be at least 6 characters long");
    });

    it("reject password mismatch", async () => {
      let authContext: any;

      const TestWrapper = () => {
        authContext = useAuth();
        return <View />;
      };

      render(
        <AuthProvider>
          <TestWrapper />
        </AuthProvider>
      );

      await expect(
        authContext.createUser("test@gmail.com", "qwerty", "different")
      ).rejects.toThrow("Passwords do not match");
    });
  });

  // Sign Out tests
  describe("Sign Out", () => {
    it("should clear user data on sign out", async () => {
      let authContext: any;

      const TestWrapper = () => {
        authContext = useAuth();
        return <View />;
      };

      render(
        <AuthProvider>
          <TestWrapper />
        </AuthProvider>
      );

      // Test that signOutUser doesn't throw an error
      await expect(authContext.signOutUser()).resolves.not.toThrow();
    });
  });
});
