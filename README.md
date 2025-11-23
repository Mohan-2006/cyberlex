# CyberLex AI

A React-based Cyber Law Advisor web application 

## Prerequisites

1.  **Node.js**: Install from [nodejs.org](https://nodejs.org/) (Version 18+ recommended).
2.  **API Key**: You need a Google Gemini API Key 

## Setup Instructions

### 1. Create a Project Folder
Create a new folder on your computer and open it in your code editor (like VS Code).

### 2. Initialize the Project
Open your terminal in that folder and run:
```bash
npm create vite@latest cyberlex -- --template react-ts
cd cyberlex
npm install
npm install @google/genai react-router-dom
```

### 3. Add Tailwind CSS
Follow standard Tailwind setup:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
Update `tailwind.config.js` to match the configuration found in the `index.html` file provided in the project source (add the custom colors and fonts).

### 4. Copy Files
Copy the source code files (App.tsx, components/, services/, types.ts) into the `src/` folder of your new project. 

### 5. Configure API Key
Create a `.env` file in the root of your project:
```
VITE_API_KEY=your_actual_api_key_here
```


### 6. Run Locally
```bash
npm run dev
```

# cyberlex
