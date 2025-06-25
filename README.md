# 🤖 Clara – AI-Powered Professional Engagement Assistant

## 📌 Project Overview

- **Author Contact:** wickramasinghemgdd@gmail.com  
- **Project Goal:** Enable intelligent, automated, and personalized engagement for anyone interested in learning about the user's professional background.

---

## 🧠 Description

**Clara** is an AI-powered personal assistant designed to provide an interactive, smart, and conversational way for visitors to explore a professional profile. Whether they're recruiters, collaborators, or curious professionals, Clara engages them contextually, gauges their interest, and follows up based on their engagement level.

She automates conversations, provides personalized information, and enhances professional visibility through intelligent communication.

---

## 🚀 Features

### 1. AI-Powered Conversations

- Uses **Google Gemini API** to understand and respond to natural language.
- Detects **sentiment**, **intent**, and **engagement depth** (Casual, Active, Deep).
- Provides context-aware answers about experience, skills, and projects.

### 2. Adaptive Engagement Levels

- Tracks each user's interaction behavior.
- Classifies users into **Casual**, **Active**, or **Deep** engagement tiers.
- Enables contextually appropriate follow-up workflows based on interaction depth.

### 3. Automated Follow-ups

- Integrates with **Gmail API** to send **personalized email follow-ups** after interactions.
- Email content adapts to user behavior and engagement level.

### 4. Firebase Authentication

- Uses **Firebase Google Login** to authenticate users securely and seamlessly.
- Personalizes sessions and enables follow-up tracking across visits.

### 5. Seamless Workflow Automation

- Uses **Make.com** to connect chat insights, engagement levels, and Gmail follow-up automation.
- Ensures smooth, hands-free operation from first message to final email.

---

## 🛠️ Technical Architecture

### Frontend

- **React.js** (built with **Vite**)
- **Tailwind CSS** for styling
- **Firebase Authentication** for Google Login
- Handles user interaction, chatbot UI, and stats display

### Backend

- **Node.js** with **Express.js**
- **Google Gemini API** integration for NLP and intent analysis
- **Gmail API** for email automation
- **MongoDB** for storing interaction logs and engagement data
- **Make.com** for workflow automation and email triggering

---

## 🔁 Operational Workflow

1. A user visits the website and logs in via **Google**.
2. The user interacts with **Clara** through a chat interface.
3. Conversations are sent to the **backend**, which processes them using the **Gemini API**.
4. Engagement level is calculated and logged.
5. Based on interaction depth, Clara sends an automated **personalized email follow-up** via the **Gmail API**.
6. All operations (chat → analysis → email) are orchestrated via **Make.com** for a seamless experience.

---

## 🧪 Getting Started

### Prerequisites

- Node.js (LTS) and npm installed
- MongoDB instance (local or cloud)
- Google Gemini API key
- Gmail API credentials
- Firebase project with Google Login enabled
- Git installed

---

### Backend Setup

```bash
git clone [repository URL]
cd [project directory]/backend
npm install
# Create a config.js or .env file with:
# - Google Gemini API key
# - Gmail API credentials
# - MongoDB URI
npm start
