# Quickstart Guide

Follow these steps to get NEXUSFLOW running locally on your machine.

## 1. Install Dependencies

Open your terminal in the project folder and run:

```bash
# 1. Initialize project (if you haven't already)
npm init -y

# 2. Install Core Dependencies
npm install react react-dom lucide-react recharts @google/genai

# 3. Install Development Tools (Vite, TypeScript, Tailwind)
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom @types/node autoprefixer postcss tailwindcss
```

## 2. Configure Start Script

Open the `package.json` file in your project root and update the `"scripts"` section to include the start command:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "start": "vite"
  }
}
```

*Note: This fixes the "Missing script: start" error.*

## 3. Run the App

Now you can start the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 4. (Optional) Local AI Setup (Ollama)

To use the local AI features:

1.  **Install Ollama** from [ollama.com](https://ollama.com).
2.  **Pull a model**: `ollama pull llama3`
3.  **Enable CORS**:
    *   **Mac/Linux**: `launchctl setenv OLLAMA_ORIGINS "*"`
    *   **Windows**: Add a System Environment Variable named `OLLAMA_ORIGINS` with value `*`.
4.  **Restart Ollama**.
