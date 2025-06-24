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
    background: "#0d0c1d",
    backgroundSecondary: "#13112b",
    backgroundTertiary: "#171533",
    accentPrimary: "#7b5cf5",
    accentSecondary: "#a88bff",
    accentTertiary: "#553dbf",
    border: "#2e2852",
    textPrimary: "#ffffff",
    textSecondary: "#a8a8bc",
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
                      src: "https://res.cloudinary.com/dbjgffukp/image/upload/v1745491107/Leonardo_Phoenix_10_Create_a_futuristic_and_instantly_recogniz_2_opn01j.jpg",
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
                  <ViewStats />
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
                    <Chip
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleQuickPromptClick(item.prompt)}
                      disabled={loading}
                      size="sm"
                      style={{
                        backgroundColor: colors.accentTertiary,
                        color: colors.textPrimary,
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      {item.text}
                    </Chip>
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
                    variant="flat"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask your question ..."
                    disabled={loading}
                    className="text-black"
                  />
                  <Button
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    disabled={loading || !inputValue.trim()}
                    size="md"
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
                            src="https://res.cloudinary.com/dbjgffukp/image/upload/v1745491107/Leonardo_Phoenix_10_Create_a_futuristic_and_instantly_recogniz_2_opn01j.jpg"
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
                        src="https://res.cloudinary.com/dbjgffukp/image/upload/v1745491107/Leonardo_Phoenix_10_Create_a_futuristic_and_instantly_recogniz_2_opn01j.jpg"
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
                    <h3 className="font-medium">Insights</h3>
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
                            style={{ color: colors.accentSecondary }}
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
                      className="mb-4 flex justify-center"
                    >
                      <Card
                        className="w-[240px] h-[240px] border-none"
                        style={{
                          background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentTertiary})`,
                          borderColor: colors.border,
                          borderWidth: "1px",
                          borderStyle: "solid",
                        }}
                      >
                        <CardBody className="justify-center items-center pb-0">
                          <CircularProgress
                            classNames={{
                              svg: "w-36 h-36 drop-shadow-md",
                              indicator: "stroke-white",
                              track: "stroke-white/10",
                              value: "text-3xl font-semibold text-white",
                            }}
                            showValueLabel={true}
                            strokeWidth={4}
                            value={interestRate}
                          />
                        </CardBody>
                        <CardFooter className="justify-center items-center pt-0">
                          <Chip
                            classNames={{
                              base: "border-1 border-white/30",
                              content: "text-white/90 text-small font-semibold",
                            }}
                            variant="bordered"
                          >
                            Interest Percentage
                          </Chip>
                        </CardFooter>
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
                        className="col-span-12 md:col-span-6 mb-6 md:mb-0 text-black"
                        label="Conversation Summary"
                        labelPlacement="inside"
                        placeholder="No summary available"
                        variant="faded"
                        color="secondary"
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
