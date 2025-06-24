// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../lib/firebase"; 

function Header() {
  const [user, setUser] = useState(null); // State to hold the current user

  useEffect(() => {
    // This listener is crucial! It keeps your UI in sync with the user's auth state.
    // If they sign in, sign out, or their token refreshes, this tells your component.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update our React state with the current user object
    });

    // Cleanup: When the component unmounts, stop listening to auth changes
    return () => unsubscribe();
  }, []);

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // The `result.user` object now contains displayName, email, photoURL!
      console.log("Signed in successfully:", result.user.displayName);
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      // You could display an error message to the user here
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("User signed out.");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <header
      style={{
        padding: "20px",
        background: "#f0f0f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #ccc",
      }}
    >
      <h1>My Awesome App</h1>
      <div style={{ display: "flex", alignItems: "center" }}>
        {user ? (
          <>
            {/* Display profile picture if available */}
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%", // Makes it round!
                  marginRight: "10px",
                  border: "2px solid #ddd",
                }}
              />
            )}
            <div style={{ marginRight: "15px", textAlign: "right" }}>
              {/* Display name, falling back to email if name isn't set */}
              <p style={{ margin: "0", fontWeight: "bold" }}>
                {user.displayName || "No Name Set"}
              </p>
              {/* Display email */}
              <p style={{ margin: "0", fontSize: "0.9em", color: "#555" }}>
                {user.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                padding: "8px 15px",
                cursor: "pointer",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={handleSignInWithGoogle}
            style={{
              padding: "8px 15px",
              cursor: "pointer",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Sign in with Google
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
