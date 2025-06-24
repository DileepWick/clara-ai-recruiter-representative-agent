// src/components/LoginPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../lib/firebase";

function LoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Redirect to /clara if user is authenticated
      if (currentUser) {
        navigate('/clara');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignInWithGoogle = async () => {
    setSigningIn(true);
    setError("");
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Signed in successfully:", result.user.displayName);
      // Navigation will be handled by the useEffect hook when auth state changes
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      setError("Failed to sign in. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("User signed out.");
      setError("");
    } catch (error) {
      console.error("Error signing out:", error.message);
      setError("Failed to sign out. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  // If user is authenticated, they will be redirected by useEffect
  // So we only render the login form here
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.loginSection}>
          <div style={styles.loginHeader}>
            <h1 style={styles.appTitle}>My Awesome App</h1>
            <p style={styles.loginSubtitle}>
              Sign in to access your account
            </p>
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <div style={styles.buttonGroup}>
            <button
              onClick={handleSignInWithGoogle}
              disabled={signingIn}
              style={{
                ...styles.button,
                ...styles.googleButton,
                ...(signingIn ? styles.buttonDisabled : {})
              }}
            >
              {signingIn ? (
                <span style={styles.buttonContent}>
                  <div style={styles.spinner}></div>
                  Signing in...
                </span>
              ) : (
                <span style={styles.buttonContent}>
                  <svg style={styles.googleIcon} viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </span>
              )}
            </button>
          </div>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  loadingSpinner: {
    fontSize: "18px",
    color: "white",
  },
  // Login section styles
  loginSection: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  loginHeader: {
    marginBottom: "8px",
  },
  appTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1a1a1a",
    margin: "0 0 8px 0",
  },
  loginSubtitle: {
    fontSize: "16px",
    color: "#666",
    margin: "0",
  },
  errorMessage: {
    background: "#fee",
    color: "#c33",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "14px",
    border: "1px solid #fcc",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  button: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "48px",
  },
  googleButton: {
    background: "white",
    color: "#1a1a1a",
    border: "2px solid #e1e5e9",
  },
  buttonDisabled: {
    opacity: "0.6",
    cursor: "not-allowed",
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  googleIcon: {
    width: "20px",
    height: "20px",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid #f3f3f3",
    borderTop: "2px solid #666",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  footer: {
    marginTop: "16px",
  },
  footerText: {
    fontSize: "12px",
    color: "#888",
    margin: "0",
    lineHeight: "1.4",
  },
};

export default LoginPage;