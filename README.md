# Automated Strategic Recruiter Interaction Agent (Clara)

**Author:** Dileepa Dilshan
**Author Contact:** wickramasinghemgdd@gmail.com
**Project Goal:** Automate and improve recruiter interactions through strategic communication and data analysis.

## Description

ASRIIA (Automated Strategic Recruiter Interaction Agent) is a project designed to streamline and enhance interactions between job seekers and recruiters. Leveraging a Google Gemini-powered chatbot and a robust backend, ASRIIA automates initial conversations, provides tailored information, tracks recruiter interest, and offers data-driven insights. The goal is to present a professional and engaging online presence that intelligently responds to recruiter inquiries, manages communication flow, and provides valuable analytics on recruiter engagement.

## Features

Based on the detailed information provided, ASRIIA offers a comprehensive set of features:

## Features

### 1. Intelligent Recruiter Interaction

*   **Personalized Responses:** The chatbot provides tailored and relevant responses to recruiter inquiries based on the user's profile and the context of the conversation.
*   **Strategic Communication:** Engages recruiters in a professional and informative manner, highlighting key skills and experiences.
*   **Automated Follow-up:** Potentially includes features for automated follow-up based on recruiter interactions.

### 2. Comprehensive Profile Showcase

*   Presents detailed information about the user's skills, experience, and projects.
*   Likely includes a visually appealing portfolio section.
*   May include a downloadable CV (as suggested by the `backend/asset/Dileepa Dilshan CV.pdf` file).

### 3. Gemini-Powered Chatbot

*   Utilizes the Google Gemini language model for natural language processing and conversation generation.
*   **Dynamic Content Generation:** Generates human-like responses and potentially updates based on interaction history.
*   **Contextual Understanding:** Understands the nuances of recruiter questions and provides relevant information.

### 4. Automated Data Collection and Analysis

*   **Recruiter Interest Tracking:** Captures and stores data on recruiter interactions and interests (indicated by `backend/models/RecruiterInterest.js`, `backend/controllers/statController.js`, and `backend/routes/statsRoute.js`).
*   **Conversation Analysis:** Analyzes chat transcripts to identify key recruiter interests, common questions, and engagement levels.
*   **Statistical Insights:** Provides statistical reports and visualizations on recruiter interactions and interests (indicated by `frontend/src/components/view_stats.jsx` and potentially related backend logic).

### 5. Real-time Notifications

*   Provides real-time notifications for new recruiter interactions or messages.
*   May include notifications for key points of interest identified during conversations.

### 6. Webhook Integration

*   Likely utilizes webhooks to facilitate real-time communication and data exchange between the frontend, backend, and potentially external services (indicated by files like `backend/Gemini/util/make_webhook.js` and `backend/Gemini/util/objection_webhook.js`).

## Technical Architecture

Based on the file structure and descriptions, the project follows a client-server architecture:

*   **Frontend:** A React application (`frontend/src`) built with Vite and styled using Tailwind CSS. This provides the user interface for the portfolio and chatbot.
*   **Backend:** A Node.js/Express.js application (`backend/`) responsible for handling API requests, interacting with the Google Gemini API, managing data (likely using Mongoose or a similar ORM with MongoDB, as suggested by `backend/models`), and handling webhook events.
*   **Google Gemini API:** Provides the core language model capabilities for the chatbot.
*   **Database:** Likely uses a NoSQL database like MongoDB to store recruiter interaction data and other relevant information.

## Workflow

1.  A recruiter visits the portfolio website (Frontend).
2.  The recruiter interacts with the chatbot (Frontend).
3.  Chat messages are sent to the Backend API.
4.  The Backend interacts with the Google Gemini API to generate responses.
5.  The Backend logs and analyzes recruiter interaction data (Database).
6.  Chatbot responses are sent back to the Frontend.
7.  Real-time notifications are potentially triggered via webhooks or other mechanisms.
8.  The user can view statistics and insights on recruiter interest (Frontend, powered by Backend data).

## Technologies Used

**Frontend:**

*   React
*   Vite
*   Tailwind CSS
*   JavaScript
*   HTML
*   Tailwind CSS

**Backend:**

*   Node.js
*   Express.js
*   Google Gemini API
*   Google Gemini API
*   MongoDB (likely used with Mongoose)
*   JavaScript

## Installation

**Prerequisites:**

*   Node.js and npm installed
*   Access to a Google Gemini API key and potentially other necessary API keys or credentials.
*   MongoDB installed and running (or access to a MongoDB cloud instance).

**Backend Setup:**

1.  Navigate to the `backend` directory.
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the `backend` directory and add your Google Gemini API key and any other necessary configuration variables (e.g., MongoDB connection string). Refer to a `.env.example` file if available.
4.  Start the backend server: `npm start`

**Frontend Setup:**

1.  Navigate to the `frontend` directory.
2.  Install dependencies: `npm install`
3.  Start the frontend development server: `npm run dev` or `npm start` (depending on the frontend setup).

## Usage

1.  Ensure both the backend and frontend servers are running.
2.  Access the ASRIIA application through your web browser at the address provided by the frontend development server (usually `http://localhost:5173/` or similar).
3.  Explore the portfolio sections to learn about my work.
4.  Interact with the chatbot to ask questions and get more information.
5.  If applicable, access any administrative or statistics viewing sections to see recruiter interaction data.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Potential Future Enhancements (Based on Provided Information)

The provided information suggests several potential areas for future development, including:

*   More advanced conversation analysis for deeper insights.
*   Integration with other platforms or services.
*   Refinement of the webhook functionality.
*   Further development of the statistical reporting features.
*   Implementation of more sophisticated automated follow-up mechanisms.

## Contributing

[If you are open to contributions, add a section here explaining how others can contribute to the project. Include guidelines for submitting issues, pull requests, etc.]

## Contact

[Provide contact information for the project author for inquiries or support.]
