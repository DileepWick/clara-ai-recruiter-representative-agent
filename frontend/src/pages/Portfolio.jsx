"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  RefreshCw,
  Briefcase,
  Code,
  Clock,
  PenTool,
  Users,
  Puzzle,
  GraduationCap,
  Target,
  Coffee,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";

import { initChat } from "../services/chat_services/init_chat.js";
import { sendChatMessage } from "../services/chat_services/send_message.js";
import {
  CircularProgress,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Input,
} from "@heroui/react";
import { User, Link } from "@heroui/react";
import { Textarea, Avatar } from "@heroui/react";
import ViewStats from "../components/view_stats.jsx";
import { useAuth } from "../contexts/AuthContext";

// Main all-in-one component
export default function SimpleChatTest() {
  // State variables
  const [sessionId, setSessionId] = useState(() => {
    return sessionStorage.getItem("chatSessionId") || `session_${Date.now()}`;
  });

  //Chat Info
  const [conversationSummary, setConversationSummary] = useState("");
  const [interestRate, setInterestRate] = useState(0);
  const [recruiterName, setRecruiterName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showInsightPanel, setShowInsightPanel] = useState(false);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);
  const { user, signOut } = useAuth();

  // Window size tracking for responsive design
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const isMobile = windowWidth < 768;

  // Effect for window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Predefined quick prompts for recruiters speaking with freshers/interns
  const quickPrompts = [
    {
      icon: <GraduationCap size={16} />,
      text: "About",
      prompt: "Tell me about Dileepa's background and interests.",
    },
    {
      icon: <Code size={16} />,
      text: "Technical skills",
      prompt:
        "What programming languages or technical skills have Dileepa learned so far?",
    },
    {
      icon: <PenTool size={16} />,
      text: "Projects",
      prompt: "Have Dileepa worked on any academic or personal projects ?",
    },
    {
      icon: <Briefcase size={16} />,
      text: "Education",
      prompt: "Tell me about Dileepa's education background ?",
    },
  ];

  // Initialize chat when component mounts
  useEffect(() => {
    sessionStorage.setItem("chatSessionId", sessionId);
    initializeChat();
  }, [sessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.parentElement;
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [chatHistory]);

  // Initialize chat - API call
  const initializeChat = async () => {
        setLoading(true);
        console.log("Initializing chat with session ID:", sessionId);
        console.log("User data:", user.displayName, user.email);
        const prompt = `
    - You are Clara, an AI recruiter representative created by Dileepa Dilshan to showcase their development skills to recruiters.
    - You are now interacting with a person named ${user?.displayName}.
    - You can use a short form for ${user?.displayName} for ease of use and friendliness and greet the user.
    - You are designed to assist ${user?.displayName} in their interest in Dileepa's skills by providing information about  skills, projects, and education.
    - You will maintain a friendly and professional tone throughout the conversation.
    - You will not ask for personal information such as phone numbers or addresses.
    - You will not engage in any conversation that is not relevant to the job search process.
    - You will not provide any information that is not related to the job search process.
    - You will provide short and concise answers to the user's questions and add emojis for a friendly touch.
      `;
        try {
          // Call the initChat function and await result
          const initialMessage = await initChat(sessionId, prompt);
          setChatHistory([{ type: "ai", response: initialMessage }]);
          setConversationSummary("");
          setInterestRate(0);
          setRecruiterName(user?.displayName || "");
          setEmail(user?.email || "");
        } catch (error) {
          console.error("Error in initializeChat:", error);
        } finally {
          setLoading(false);
          console.log("Chat initialization completed.");
        }
  };

  // Create new session
  const handleNewSession = () => {
    const newSessionId = `session_${Date.now()}`;
    setSessionId(newSessionId);
    setChatHistory([]);
  };

  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendMessage(inputValue);
    setInputValue("");

    // Focus back on input after sending
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  };

  // Handle quick prompt click
  const handleQuickPromptClick = (prompt) => {
    if (loading) return;
    sendMessage(prompt);
  };

  // Toggle insight panel visibility (for mobile)
  const toggleInsightPanel = () => {
    setShowInsightPanel(!showInsightPanel);
  };

  // Send message to API
  const sendMessage = async (message) => {
    setChatHistory((prev) => [...prev, { type: "user", prompt: message }]);
    setLoading(true);

    try {
      const { result, summary } = await sendChatMessage(
        message,
        sessionId,
        user?.displayName,
        user?.email
      );

      setChatHistory((prev) => [...prev, { type: "ai", response: result }]);
      setConversationSummary(summary.summary);
      setInterestRate(summary.engagementPercentage);
      setRecruiterName(summary.userName);
      setCompany(summary.company);
      setEmail(summary.email);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        {
          type: "ai",
          response:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
      // Ensure scroll to bottom after new message
      setTimeout(scrollToBottom, 100);
    }
  };

  // Format session ID for display
  const formatSessionId = (id) => {
    if (!id) return "";
    // If it starts with "session_", remove it and format the timestamp
    if (id.startsWith("session_")) {
      const timestamp = id.replace("session_", "");
      const date = new Date(Number.parseInt(timestamp));
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
    return id;
  };

  // Function to handle scrolling chat to bottom
  const scrollToBottom = () => {
    const chatContainer = document.querySelector(".chat-messages-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    handleNewSession();
    try {
      await signOut();
      // User will be redirected to login page automatically
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  // Leonardo.ai inspired color variables
  const colors = {
    background: "#020305", // Even deeper black
    backgroundSecondary: "#080b0e", // Slightly lighter for contrast
    backgroundTertiary: "#0e1217", // Cards and inputs, still very dark

    accentPrimary: "#0fa59b", // Slightly darker teal
    accentSecondary: "#8f46d5", // Slightly deeper violet
    accentTertiary: "#1faa4d", // Darker lime green

    border: "#161d2a", // Very dark gray-blue for subtle borders
    textPrimary: "#e2e8f0", // Slightly muted white for eye comfort
    textSecondary: "#7b8799", // Dark muted blue-gray for secondary text
  };

  return (
    <div
      style={{
        background: colors.background,
      }}
    >
      <div
        className="container h-screen text-white font-poppins"
        style={{
          fontFamily: "Poppins",
          background: colors.background,
        }}
      >
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 h-full">
          {/* CHAT SECTION */}
          <div
            className={`${isMobile ? "w-full" : "col-span-2"} h-[calc(100vh-2rem)]`}
          >
            <div
              className="relative w-full h-full shadow-lg overflow-hidden rounded-lg"
              style={{
                background: colors.backgroundSecondary,
                borderColor: colors.border,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              {/* Header - Fixed height */}
              <div
                className="absolute top-0 left-0 right-0 z-30 p-3 text-white flex justify-between items-center"
                style={{
                  background: colors.backgroundSecondary,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <User
                    avatarProps={{
                      src: "https://res.cloudinary.com/dbjgffukp/image/upload/v1750800029/Leonardo_Kino_XL_Animestyle_portrait_of_Clara_a_futuristic_fem_0_sugsfn.jpg",
                    }}
                    description="Recruiter Rep"
                    name="Clara"
                    className="text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {isMobile && (
                    <Button
                      style={{
                        backgroundColor: colors.accentPrimary,
                        color: colors.textPrimary,
                      }}
                      onClick={toggleInsightPanel}
                      size="sm"
                      isIconOnly
                    >
                      <Menu size={18} />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    onClick={handleSignOut}
                    style={{
                      padding: "8px 16px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>

              {/* Quick Prompts - Fixed height */}
              <div
                className="absolute top-[57px] left-0 right-0 z-30 px-3 py-2 overflow-x-auto"
                style={{
                  background: colors.backgroundTertiary,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <div className="flex gap-2">
                  {quickPrompts.map((item, index) => (
                    <Button
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleQuickPromptClick(item.prompt)}
                      disabled={loading}
                      size="sm"
                      
                    >
                      {item.text}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input Area - Fixed height at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 z-30 p-3"
                style={{
                  background: colors.backgroundSecondary,
                  borderTop: `1px solid ${colors.border}`,
                }}
              >
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    ref={chatInputRef}
                    type="text"
                    variant="underlined"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Anything on your mind to ask Clara?"
                    disabled={loading}
                    className="text-black dark"
                  />
                  <Button
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    disabled={loading || !inputValue.trim()}
                    size="md"
                    className="dark"

                    isIconOnly
                    style={{
                      backgroundColor: colors.accentPrimary,
                      color: colors.textPrimary,
                    }}
                  >
                    <Send size={18} />
                  </Button>
                </form>
              </div>

              {/* Chat Messages - Absolute positioning with top and bottom offsets */}
              <div
                className="absolute top-[105px] bottom-[65px] left-0 right-0 p-4 overflow-y-auto chat-messages-container scrollbar-thin"
                style={{
                  background: colors.backgroundSecondary,
                  scrollBehavior: "smooth",
                  scrollbarWidth: "thin",
                  scrollbarColor: `${colors.accentPrimary} ${colors.backgroundTertiary}`,
                }}
              >
                {/* Add these style elements for webkit browsers */}
                <style jsx>{`
                  .chat-messages-container::-webkit-scrollbar {
                    width: 6px;
                  }
                  .chat-messages-container::-webkit-scrollbar-track {
                    background: ${colors.backgroundTertiary};
                    border-radius: 3px;
                  }
                  .chat-messages-container::-webkit-scrollbar-thumb {
                    background-color: ${colors.accentTertiary};
                    border-radius: 3px;
                    transition: background-color 0.3s;
                  }
                  .chat-messages-container::-webkit-scrollbar-thumb:hover {
                    background-color: ${colors.accentPrimary};
                  }
                `}</style>

                <AnimatePresence initial={false}>
                  {chatHistory.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`mb-4 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.type === "ai" && (
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
                          <Avatar
                            isBordered
                            color="secondary"
                            src="https://res.cloudinary.com/dbjgffukp/image/upload/v1750800029/Leonardo_Kino_XL_Animestyle_portrait_of_Clara_a_futuristic_fem_0_sugsfn.jpg"
                          />
                        </div>
                      )}

                      <div className={`max-w-[75%]`}>
                        {message.type === "user" ? (
                          <div>
                            <div
                              className="text-white rounded-2xl rounded-tr-sm p-3 shadow-md"
                              style={{ backgroundColor: colors.accentPrimary }}
                            >
                              {message.prompt}
                            </div>
                            <div
                              className="text-xs mt-1 text-right pr-2"
                              style={{ color: colors.textSecondary }}
                            >
                              You
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div
                              className="text-white rounded-2xl rounded-tl-sm p-3 shadow-md"
                              style={{
                                backgroundColor: colors.backgroundTertiary,
                                borderColor: colors.border,
                                borderWidth: "1px",
                                borderStyle: "solid",
                              }}
                            >
                              {message.response
                                .split("\n")
                                .map((paragraph, i) => (
                                  <p key={i} className={i > 0 ? "mt-2" : ""}>
                                    {paragraph}
                                  </p>
                                ))}
                            </div>
                            <div
                              className="text-xs mt-1 pl-2"
                              style={{ color: colors.textSecondary }}
                            >
                              Clara
                            </div>
                          </div>
                        )}
                      </div>

                      {message.type === "user" && (
                        <div
                          className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ml-2"
                          style={{ backgroundColor: colors.accentTertiary }}
                        >
                          {" "}
                          <Avatar
                            isBordered
                            color="secondary"
                            src={user.photoURL}
                          />
                          <div className="text-white w-full h-full flex items-center justify-center font-bold">
                            You
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <div className="flex items-center gap-2 pl-10">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
                      <Avatar
                        isBordered
                        color="secondary"
                        src="https://res.cloudinary.com/dbjgffukp/image/upload/v1750800029/Leonardo_Kino_XL_Animestyle_portrait_of_Clara_a_futuristic_fem_0_sugsfn.jpg"
                      />
                    </div>
                    <div
                      className="rounded-2xl rounded-tl-sm p-3 shadow-md inline-flex items-center"
                      style={{
                        backgroundColor: colors.backgroundTertiary,
                        borderColor: colors.border,
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                        className="flex space-x-1.5"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: colors.accentPrimary }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: colors.accentPrimary,
                            animationDelay: "0.2s",
                          }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: colors.accentPrimary,
                            animationDelay: "0.4s",
                          }}
                        ></div>
                      </motion.div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* INSIGHT PANEL - Responsive design */}
          <AnimatePresence>
            {(showInsightPanel || !isMobile) && (
              <motion.div
                initial={isMobile ? { x: "100%" } : { opacity: 0 }}
                animate={isMobile ? { x: 0 } : { opacity: 1 }}
                exit={isMobile ? { x: "100%" } : { opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`${isMobile ? "fixed inset-0 z-40 flex flex-col" : "col-span-1"}`}
                style={{
                  background: isMobile ? colors.background : "transparent",
                }}
              >
                <div
                  className={`${
                    isMobile ? "flex-1" : "h-[calc(100vh-2rem)]"
                  } rounded-lg flex flex-col shadow-lg relative overflow-hidden`}
                  style={{
                    background: colors.backgroundSecondary,
                    borderColor: colors.border,
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                >
                  {/* Insight Header */}
                  <div
                    className="absolute top-0 left-0 right-0 z-10 p-3 text-white rounded-t-lg flex justify-between items-center"
                    style={{
                      background: colors.backgroundSecondary,
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <Chip variant="dot" color="success" className="text-white">Insights Panel</Chip>
                    {isMobile && (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleInsightPanel}
                        className="text-white p-1.5 rounded-full"
                        style={{ backgroundColor: colors.accentTertiary }}
                      >
                        <X size={18} />
                      </motion.button>
                    )}
                  </div>

                  {/* Insight Content */}
                  <div
                    className="absolute top-[57px] bottom-0 left-0 right-0 p-4 overflow-y-auto overflow-x-hidden insight-panel-container"
                    style={{ background: colors.backgroundSecondary }}
                  >
                    <style jsx>{`
                      .insight-panel-container::-webkit-scrollbar {
                        width: 6px;
                      }
                      .insight-panel-container::-webkit-scrollbar-track {
                        background: ${colors.backgroundTertiary};
                        border-radius: 3px;
                      }
                      .insight-panel-container::-webkit-scrollbar-thumb {
                        background-color: ${colors.accentTertiary};
                        border-radius: 3px;
                        transition: background-color 0.3s;
                      }
                      .insight-panel-container::-webkit-scrollbar-thumb:hover {
                        background-color: ${colors.accentPrimary};
                      }
                    `}</style>

                    {/* Recruiter Name */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-3 rounded-lg mb-4"
                      style={{
                        background: colors.backgroundTertiary,
                        borderColor: colors.border,
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }}
                    >
                      <User
                        avatarProps={{
                          src: user.photoURL,
                        }}
                        description={
                          <Link
                            isExternal
                            href="https://x.com/jrgarciadev"
                            size="sm"
                            style={{ color: colors.accentPrimary }}
                          >
                            {user?.email || "Email not available"}
                          </Link>
                        }
                        name={user?.displayName || "Name not available"}
                        className="text-white"
                      />
                    </motion.div>

                    {/* Interest */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mb-4 flex justify-center overflow-hidden"
                    >
                      <Card
                        className="w-[450px] h-[400px] border-none"
                        style={{
                          background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentTertiary})`,
                          borderColor: colors.border,
                          borderWidth: "1px",
                          borderStyle: "solid",
                          overflow: "hidden",
                        }}
                      >
                        <CardBody
                          className="justify-center items-center p-6"
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            className="w-full space-y-4"
                            style={{ overflow: "hidden" }}
                          >
                            {/* Clara Portrait Video */}
                            <div className="flex justify-center">
                              <div className="relative w-24 h-24 rounded-full overflow-hidden border-3 border-white/40 shadow-xl">
                                <video
                                  className="w-full h-full object-cover"
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                >
                                  <source
                                    src="https://res.cloudinary.com/dbjgffukp/video/upload/v1750806510/Generated_File_June_25_2025_-_4_18AM_fy310d.mp4"
                                    type="video/mp4"
                                  />
                                  {/* Fallback image if video fails to load */}
                                  <img
                                    src="https://res.cloudinary.com/dbjgffukp/image/upload/v1750800029/Leonardo_Kino_XL_Animestyle_portrait_of_Clara_a_futuristic_fem_0_sugsfn.jpg"
                                    alt="Clara Portrait"
                                    className="w-full h-full object-cover"
                                  />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                              </div>
                            </div>

                            {/* Timeline Header */}
                            <div className="text-center">
                              <h3 className="text-lg font-semibold text-white mb-1">
                                Engagement Progress
                              </h3>
                              <p className="text-white/70 text-xs">
                                {Math.round(interestRate)}% Complete
                              </p>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative">
                              <div className="w-full bg-white/20 rounded-full h-3">
                                <div
                                  className="bg-white rounded-full h-3 transition-all duration-500 ease-out"
                                  style={{ width: `${interestRate}%` }}
                                />
                              </div>

                              {/* Timeline Markers with Scaling Profile Pictures */}
                              <div className="flex justify-between items-end mt-4 px-2">
                                {[
                                  {
                                    milestone: 20,
                                    image:
                                      "https://res.cloudinary.com/dbjgffukp/image/upload/v1750800029/Leonardo_Kino_XL_Animestyle_portrait_of_Clara_a_futuristic_fem_0_sugsfn.jpg",
                                    label: "Casual",
                                    size: "w-12 h-12", // Base size
                                  },
                                  {
                                    milestone: 50,
                                    image:
                                      "https://res.cloudinary.com/dbjgffukp/image/upload/v1750800029/Leonardo_Kino_XL_Animestyle_portrait_of_Clara_a_futuristic_fem_0_sugsfn.jpg",
                                    label: "Active",
                                    size: "w-16 h-16", // Medium size
                                  },
                                  {
                                    milestone: 85,
                                    image:
                                      "https://res.cloudinary.com/dbjgffukp/image/upload/v1750806617/Screenshot_2025-06-25_044000_vo8obv.png",
                                    label: "Deep",
                                    size: "w-20 h-20", // Largest size
                                  },
                                ].map(
                                  (
                                    { milestone, image, label, size },
                                    index
                                  ) => (
                                    <div
                                      key={milestone}
                                      className="flex flex-col items-center"
                                    >
                                      <div
                                        className={`${size} rounded-full border-3 flex items-center justify-center overflow-hidden transition-all duration-500 transform ${
                                          interestRate >= milestone
                                            ? "bg-white border-white shadow-lg scale-105"
                                            : "bg-white/20 border-white/50 scale-95"
                                        }`}
                                        style={{
                                          filter:
                                            interestRate >= milestone
                                              ? "drop-shadow(0 4px 12px rgba(255,255,255,0.3))"
                                              : "none",
                                        }}
                                      >
                                        <img
                                          src={image}
                                          alt={label}
                                          className={`w-full h-full object-cover rounded-full transition-all duration-500 ${
                                            interestRate >= milestone
                                              ? "opacity-100 brightness-110"
                                              : "opacity-50 brightness-75"
                                          }`}
                                        />
                                      </div>
                                      <span
                                        className={`text-xs mt-2 font-medium transition-all duration-300 ${
                                          interestRate >= milestone
                                            ? "text-white text-shadow"
                                            : "text-white/60"
                                        }`}
                                      >
                                        {label}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>

                    {/* Conversation Summary */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="p-3 mb-4"
                    >
                      <Textarea
                        className="col-span-12 md:col-span-6 mb-6 md:mb-0 text-black dark"
                        label="Conversation Summary"
                        labelPlacement="inside"
                        placeholder="Summary of the conversation will appear here..."
                        variant="flat"
                        value={conversationSummary}

                      
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
