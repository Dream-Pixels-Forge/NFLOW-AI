
import { sendMessageToGemini } from "./geminiService";
import { sendMessageToOllama } from "./ollamaService";
import { AgentMode, Message, ToolState, Task, AppSettings } from "../types";

const TECHNICAL_AGENTS = [
  AgentMode.CODER,
  AgentMode.ARCHITECT,
  AgentMode.TEST,
  AgentMode.SECURE,
  AgentMode.DEPLOY
];

export const sendMessageToAgent = async (
  prompt: string,
  history: Message[],
  agent: AgentMode,
  tools: ToolState,
  projectSummary: string = "",
  currentTasks: Task[] = [],
  settings: AppSettings
): Promise<{ text: string; sources?: string[]; suggestedAgent?: AgentMode }> => {
  
  if (settings.aiProvider === 'ollama') {
     
     // Determine which model to use
     const isTechnical = TECHNICAL_AGENTS.includes(agent);
     const targetModel = isTechnical ? settings.ollamaCodingModel : settings.ollamaGeneralModel;

     return sendMessageToOllama(
        prompt,
        history,
        agent,
        tools,
        projectSummary,
        currentTasks,
        settings.suggestionLevel,
        settings.ollamaUrl,
        targetModel || settings.ollamaGeneralModel // Fallback to general if coding is empty
     );
  } else {
     // Default to Gemini
     return sendMessageToGemini(
        prompt,
        history,
        agent,
        tools,
        projectSummary,
        currentTasks,
        settings.suggestionLevel
     );
  }
};
