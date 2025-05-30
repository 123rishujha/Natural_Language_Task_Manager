![screencapture-localhost-5173-2025-05-29-23_46_36](https://github.com/user-attachments/assets/cb7a754b-8270-4377-8f4b-4ec39f3dee4c)# Natural Language Task Manager

## Overview

Natural Language Task Manager is a full-stack application that leverages OpenAI's GPT models to extract structured tasks from natural language input (such as meeting transcripts, notes, or free-form text). It parses tasks, assigns assignees, due dates, and priorities, and presents them in a user-friendly interface for management and tracking.

- **Frontend:** React (with Vite, TailwindCSS, Lucide icons)
- **Backend:** Node.js (Express, OpenAI API)

## Features
- Input natural language and extract multiple structured tasks
- Automatic parsing of assignee, due date, and priority
- View, edit, and manage tasks in a modern UI
- Uses OpenAI GPT-3.5-turbo for robust task parsing

## Project Structure

```
Natural_Language_Task_Manager/
├── backend/        # Express backend API
│   ├── index.js
│   ├── package.json
│   └── ...
├── frontend/       # React frontend app
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md       # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm (comes with Node.js)
- OpenAI API key (for backend)

### 1. Clone the repository
```sh
git clone <repo-url>
cd Natural_Language_Task_Manager
```

### 2. Backend Setup
```sh
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```
Start the backend server:
```sh
npm run dev
```

### 3. Frontend Setup
```sh
cd ../frontend
npm install
npm run dev
```
The frontend will run by default on [http://localhost:5173](http://localhost:5173).

### 4. Usage
- Open the frontend in your browser.
- Enter a block of text with tasks (e.g., meeting notes).
- The app will parse and display structured tasks with assignee, due date, and priority.

## Customization
- **Task Parsing Logic:** Edit the prompt in `backend/index.js` for custom parsing rules.
- **UI/UX:** Modify React components in `frontend/src/components`.

## Troubleshooting
- Ensure both backend and frontend servers are running.
- Check `.env` for correct OpenAI API key.
- Review browser and server console for errors.

## Output


![screencapture-localhost-5173-2025-05-29-23_46_36](https://github.com/user-attachments/assets/adf3043a-f35e-4fa1-a340-7b2a63c8b5af)
