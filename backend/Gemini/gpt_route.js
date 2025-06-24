import express from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";

import {
  Gemini_model,
  generationConfigurations,
} from "./models/gemini_model.js";
import { updateSummary } from "./util/updateSummary.js"; // Import the utility function

const GPTRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const model = Gemini_model;
const generationConfig = generationConfigurations;

// In-memory session storage
const sessions = new Map();

// 💬 Route for regular chat messages with dynamic summary updates
GPTRouter.post("/chat", async (req, res) => {
  const { sessionId, prompt ,userName , email} = req.body;

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "Valid sessionId is required" });
  }

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Valid prompt is required" });
  }

  try {
    const sessionData = sessions.get(sessionId);
    if (!sessionData) {
      return res.status(404).json({ error: "Session not found" });
    }

    const result = await sessionData.session.sendMessage(prompt);
    const responseText = result.response.text();

    // 🔁 Update summary with new exchange
    const updatedSummary = await updateSummary({
      summary: sessionData.summary || "",
      latestUserMessage: prompt,
      latestAIResponse: responseText,
      sessionId,
      userName,
      email,
    });

    // 💾 Save updated summary back to session
    sessions.set(sessionId, {
      ...sessionData,
      summary: updatedSummary.summary,
    });

    res.status(200).json({
      result: responseText,
      summary: updatedSummary,
    });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({
      error: "Failed to generate response",
      message: error.message || "An unexpected error occurred",
    });
  }
});

// 🚀 Route to initialize chat session with optional CV upload
GPTRouter.post("/chat/init", upload.single("cv"), async (req, res) => {
  const { sessionId, characterPrompt } = req.body;

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "Valid sessionId is required" });
  }

  try {
    let fileBuffer;

    const localPdfPath = path.join(
      process.cwd(),
      "asset",
      "Dileepa Dilshan CV.pdf"
    );
    fileBuffer = await fs.readFile(localPdfPath);

    const filePart = {
      inlineData: {
        data: Buffer.from(fileBuffer).toString("base64"),
        mimeType: "application/pdf",
      },
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    sessions.set(sessionId, {
      session: chatSession,
      characterPrompt,
      summary: "", // Initial empty summary
    });

    const result = await chatSession.sendMessage([
      {
        text: `${characterPrompt}`
      },
      filePart,
    ]);

    res.status(200).json({ result: result.response.text(), summary: "" });
  } catch (error) {
    console.error("Init Error:", error);
    res.status(500).json({
      error: "Failed to initialize chat",
      message: error.message || "An unexpected error occurred",
    });
  }
});

export default GPTRouter;
