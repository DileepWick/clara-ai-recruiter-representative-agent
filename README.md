# Automated Strategic Recruiter Interaction Agent (Clara) - Project Documentation

## Project Overview
**Author Contact:** wickramasinghemgdd@gmail.com
**Project Goal:** Automate and improve recruiter interactions through strategic communication and data analysis.

## Description

Clara is a project designed to streamline and enhance interactions between job seekers and recruiters. Leveraging a Google Gemini-powered chatbot and a robust backend, ASRIIA automates initial conversations, provides tailored information, tracks recruiter interest, and offers data-driven insights. The goal is to present a professional and engaging online presence that intelligently responds to recruiter inquiries, manages communication flow, and provides valuable analytics on recruiter engagement.

## Features

### 1. Intelligent Recruiter Interaction

*   **Personalized Responses:** The chatbot provides tailored and relevant responses to recruiter inquiries based on the user's profile and the context of the conversation.
*   **Strategic Communication:** Engages recruiters in a professional and informative manner, highlighting key skills and experiences.
*   **Automated Follow-up:** Potentially includes features for automated follow-up based on recruiter interactions.

### 2. Comprehensive Profile Showcase

*   Presents detailed information about the user's skills, experience, and projects.
*   Includes a visually appealing portfolio section.
*   May include a downloadable CV (as suggested by the `backend/asset/Dileepa Dilshan CV.pdf` file).

### 3. Gemini-Powered Chatbot

*   Utilizes the Google Gemini language model for natural language processing and conversation generation.
*   **Dynamic Content Generation:** Generates human-like responses and updates based on interaction history.
*   **Contextual Understanding:** Understands the nuances of recruiter questions and provides relevant information.

### 4. Automated Data Collection and Analysis

*   **Recruiter Interest Tracking:** Captures and stores data on recruiter interactions and interests (indicated by `backend/models/RecruiterInterest.js`, `backend/controllers/statController.js`, and `backend/routes/statsRoute.js`).
*   **Conversation Analysis:** Analyzes chat transcripts to identify key recruiter interests, common questions, and engagement levels.
*   **Statistical Insights:** Provides statistical reports and visualizations on recruiter interactions and interests (indicated by `frontend/src/components/view_stats.jsx` and related backend logic).

### 5. Real-time Notifications

*   Provides real-time notifications for new recruiter interactions or messages.
*   May include notifications for key points of interest identified during conversations.

### 6. Webhook Integration

*   Likely utilizes webhooks to facilitate real-time communication and data exchange between the frontend, backend, and potentially external services (indicated by files like `backend/Gemini/util/make_webhook.js` and `backend/Gemini/util/objection_webhook.js`).
*   Enables seamless integration with external services for enhanced functionality.
## Technical Architecture

Based on the file structure and descriptions, the project follows a client-server architecture:

*   **Frontend:** A React application (`frontend/src`) built with Vite and styled using Tailwind CSS. This provides the user interface for the portfolio and chatbot.
*   **Backend:** A Node.js/Express.js application (`backend/`) responsible for handling API requests, interacting with the Google Gemini API, managing data (likely using Mongoose or a similar ORM with MongoDB, as suggested by `backend/models`), and handling webhook events.
*   **Google Gemini API:** Provides the core language model capabilities for the chatbot.
*   **Database:** Likely uses a NoSQL database like MongoDB to store recruiter interaction data and other relevant information.
*   **External Services:** Potential integration with email, messaging, or other recruitment platforms via APIs and webhooks.
## Operational Workflow

1.  A recruiter visits the portfolio website (Frontend).
2.  The recruiter interacts with the chatbot (Frontend).
3.  Chat messages are sent to the Backend API.
4.  The Backend interacts with the Google Gemini API to generate responses.
5.  The Backend logs and analyzes recruiter interaction data (Database).
6.  Chatbot responses are sent back to the Frontend.
7.  Real-time notifications are potentially triggered via webhooks or other mechanisms.
8.  The user can view statistics and insights on recruiter interest (Frontend, powered by Backend data).
*   Provides data-driven insights into recruiter engagement.
## Core Technologies

**Frontend:**

*   React
*   Vite
*   Tailwind CSS
*   JavaScript
*   HTML
*   Tailwind CSS

**Backend & AI:**
*   Node.js
*   Express.js
*   Google Gemini API
*   Google Gemini API
*   MongoDB 
*   JavaScript

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

**Prerequisites:**

*   Node.js (LTS version recommended) and npm installed.
*   Access to a Google Gemini API key and potentially other necessary API keys or credentials.
*   MongoDB installed and running (or access to a MongoDB cloud instance).
*   Git for cloning the repository.

**Backend Setup:**

1.  Clone the repository: `git clone [repository URL]`
2.  Navigate into the project directory: `cd [project directory]`
3.  Navigate to the backend directory: `cd backend`
4.  Install backend dependencies: `npm install`
5.  Create a `config.js` file in the `backend` directory based on a provided `config.js` (if available) and configure your Google Gemini API key, MongoDB connection string, and any other required environment variables.
6.  Start the backend server: `npm start`

**Frontend Setup:**

1.  Navigate back to the root project directory: `cd ..`
2.  Navigate to the frontend directory: `cd frontend`
3.  Install frontend dependencies: `npm install`
4.  Start the frontend development server: `npm run dev`

## Usage and Deployment

Once the backend and frontend servers are running (as per the Installation steps), access the application via the address provided by the frontend development server (typically `http://localhost:5173`). Interact with the chatbot and explore the portfolio features.

## Contributing
We welcome contributions to the Automated Strategic Recruiter Interaction Agent! If you'd like to contribute, please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and ensure the code adheres to the project's coding standards.
4.  Write clear and concise commit messages.
5.  Submit a pull request with a detailed description of your changes.

Please ensure your contributions align with the project's goals and technical architecture.

## Contact
For inquiries, support, or collaboration opportunities, please contact the project author at wickramasinghemgdd@gmail.com.
