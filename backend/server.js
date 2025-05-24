import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { mongoDBURL } from "./config.js";

//Routes
import GPTRouter from "./Gemini/gpt_route.js";
import statsRouter from "./routes/statsRoute.js"; // Adjust the import path as necessary


const app = express();

// CORS configuration to allow only your frontend URL
const corsOptions = {
  origin: "*",  // Allow frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allow specific HTTP methods
  allowedHeaders: ["Content-Type"],  // Allow headers
};

app.use(cors(corsOptions));;

app.use(bodyParser.json());

// API endpoint that sends the message
app.get("/message", (req, res) => {
  res.send("This is from the Vercel Backend.");
});

app.get("/", (req, res) => {
  res.send("This is from the Vercel Backend.");
});

// MongoDB connection
mongoose.connect(mongoDBURL)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
})


app.use("/api", GPTRouter);
app.use("/api/recruiter-interests", statsRouter); // Use the stats router for recruiter interests

// Export as a serverless function for Vercel
export default app;
