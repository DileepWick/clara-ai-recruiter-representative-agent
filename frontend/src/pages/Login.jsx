const handleGuestAccess = () => {
  alert("Demo: Would redirect to /clara as guest");
};
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../lib/firebase";

const colors = {
  background: "#000000",
  backgroundSecondary: "#0a0a0a",
  backgroundTertiary: "#111111",
  accentPrimary: "#1ed3d3",
  accentSecondary: "#c026d3",
  accentTertiary: "#10b981",
  border: "#1f1f1f",
  textPrimary: "#e5e7eb",
  textSecondary: "#94a3b8",
};

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
        navigate("/clara");
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
    const user = result.user;

    // Force refresh token to get latest profile info
    await user.getIdToken(true);

    // Reload the user to update the profile data
    await user.reload();

    // Updated profile info
    console.log("Signed in successfully:");
    console.log("Name:", user.displayName);
    console.log("Photo URL:", user.photoURL);

    // Now update your app state if needed

  } catch (error) {
    console.error("Error signing in with Google:", error.message);
    setError("Failed to sign in. Please try again.");
  } finally {
    setSigningIn(false);
  }
};


  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div
              className="w-12 h-12 rounded-full border-2 animate-spin"
              style={{
                borderColor: `${colors.border} ${colors.border} ${colors.accentPrimary} ${colors.border}`,
              }}
            ></div>
            <div
              className="absolute inset-2 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${colors.accentPrimary}20, ${colors.accentSecondary}20)`,
              }}
            ></div>
          </div>
          <div
            style={{ color: colors.textSecondary }}
            className="text-lg font-medium"
          >
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex font-poppins"
      style={{ backgroundColor: colors.background }}
    >
      {/* Left Panel */}
      <div
        className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 relative font-poppins"
        style={{ backgroundColor: colors.backgroundSecondary }}
      >
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/dbjgffukp/image/upload/v1750800029/Leonardo_Kino_XL_Animestyle_portrait_of_Clara_a_futuristic_fem_0_sugsfn.jpg"
                alt="Clara Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <span
              className="text-xl font-poppins"
              style={{ color: colors.textPrimary }}
            >
              Clara
            </span>
          </div>
        </div>

        {/* Login Form */}
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-12">
            <h1
              className="text-4xl font-poppins mb-3"
              style={{
                background: `linear-gradient(135deg, ${colors.textPrimary}, ${colors.accentPrimary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Welcome Back
            </h1>
            <p
              className="text-lg font-poppins"
              style={{ color: colors.textSecondary }}
            >
              Access Clara
            </p>
          </div>

          {error && (
            <div
              className="mb-6 p-4 rounded-xl text-sm font-poppins border"
              style={{
                backgroundColor: `${colors.backgroundTertiary}`,
                borderColor: "#ef4444",
                color: "#fca5a5",
              }}
            >
              {error}
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleSignInWithGoogle}
            disabled={signingIn}
            className="w-full py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 font-medium text-lg relative overflow-hidden group disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.backgroundTertiary,
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary,
            }}
            onMouseEnter={(e) => {
              if (!signingIn) {
                e.target.style.borderColor = colors.accentPrimary;
                e.target.style.boxShadow = `0 0 20px ${colors.accentPrimary}20`;
              }
            }}
            onMouseLeave={(e) => {
              if (!signingIn) {
                e.target.style.borderColor = colors.border;
                e.target.style.boxShadow = "none";
              }
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${colors.accentPrimary}05, ${colors.accentSecondary}05)`,
              }}
            ></div>

            {signingIn ? (
              <>
                <div
                  className="w-6 h-6 border-2 rounded-full animate-spin relative z-10"
                  style={{
                    borderColor: `${colors.border} ${colors.border} ${colors.accentPrimary} ${colors.border}`,
                  }}
                ></div>
                <span className="relative z-10">Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="relative z-10 ">Continue with Google</span>
              </>
            )}
          </button>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div
              className="text-xs font-poppins mb-2"
              style={{ color: colors.accentPrimary }}
            >
              AI-POWERED INSIGHTS
            </div>
            <p
              className="text-sm leading-relaxed font-poppins"
              style={{ color: colors.textSecondary }}
            >
              Real-time chat analysis • Sentiment detection • Automated engagement
              follow-ups
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - AI Art Showcase with Video */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br opacity-20"
          style={{
            background: `linear-gradient(135deg, ${colors.accentPrimary}10, ${colors.accentSecondary}20, ${colors.accentTertiary}10)`,
          }}
        ></div>

        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="https://res.cloudinary.com/dbjgffukp/video/upload/v1750806792/Generated_File_June_25_2025_-_3_06AM_ki8byn.mp4"
            type="video/mp4"
          />
          <source
            src="https://res.cloudinary.com/dbjgffukp/video/upload/v1750806792/Generated_File_June_25_2025_-_3_06AM_ki8byn.mp4"
            type="video/webm"
          />
          {/* Fallback image if video fails to load */}
          <img
            src="https://res.cloudinary.com/dbjgffukp/image/upload/v1750800029/Leonardo_Kino_XL_Animestyle_portrait_of_Clara_a_futuristic_fem_0_sugsfn.jpg"
            alt="AI Recruitment Analytics"
            className="w-full h-full object-cover"
          />
        </video>

        {/* Video Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.background}40, ${colors.backgroundSecondary}60, ${colors.background}80)`,
          }}
        ></div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 animate-pulse">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.accentPrimary }}
          ></div>
        </div>
        <div className="absolute top-40 right-32 animate-pulse delay-1000">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.accentSecondary }}
          ></div>
        </div>
        <div className="absolute top-60 right-16 animate-pulse delay-2000">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: colors.accentTertiary }}
          ></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-end p-12">
          <div>
            <h2
              className="text-3xl font-poppins mb-4"
              style={{
                background: `linear-gradient(135deg, ${colors.textPrimary}, ${colors.accentPrimary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              She is Clara
            </h2>
            <p
              className="text-xl leading-relaxed mb-6 font-poppins"
              style={{ color: colors.textSecondary }}
            >
She’s your smart guide to learning more about me ,my work, background, and how I can help. 
Clara will tailor your experience, keep track of what interests you, and follow up with insights just for you.
            </p>
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-1 rounded-full"
                style={{ backgroundColor: colors.accentPrimary }}
              ></div>
              <div
                className="w-8 h-1 rounded-full"
                style={{ backgroundColor: colors.accentSecondary }}
              ></div>
              <div
                className="w-4 h-1 rounded-full"
                style={{ backgroundColor: colors.accentTertiary }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
