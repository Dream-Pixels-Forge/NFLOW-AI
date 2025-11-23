
import { AgentMode, Message, ToolState, Task, SuggestionLevel } from "../types";
import { getSystemInstruction } from "./promptUtils";

export interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export interface OllamaModelListResponse {
  models: {
    name: string;
    modified_at: string;
    size: number;
    digest: string;
    details: {
      format: string;
      family: string;
      families: string[];
      parameter_size: string;
      quantization_level: string;
    }
  }[];
}

export const getOllamaModels = async (baseUrl: string): Promise<string[]> => {
  try {
    // Ensure trailing slash is removed for the fetch
    const cleanUrl = baseUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/api/tags`);
    
    if (!response.ok) {
      throw new Error(`Ollama API Error: ${response.statusText}`);
    }
    
    const data: OllamaModelListResponse = await response.json();
    return data.models.map(m => m.name);
  } catch (error) {
    // Use warn instead of error to avoid alarming console noise for expected CORS/Connection issues
    console.warn("Ollama connection check failed (using fallbacks):", error);
    throw error; // Re-throw to let the UI handle the error state
  }
};

export const sendMessageToOllama = async (
  prompt: string,
  history: Message[],
  agent: AgentMode,
  tools: ToolState,
  projectSummary: string = "",
  currentTasks: Task[] = [],
  suggestionLevel: SuggestionLevel = 'medium',
  baseUrl: string = 'http://localhost:11434',
  model: string = 'llama3'
): Promise<{ text: string; sources?: string[]; suggestedAgent?: AgentMode }> => {
  
  try {
    // Construct Context from Tools
    let contextInjection = "";
    
    if (tools.rag.active && tools.rag.content.length > 0) {
      contextInjection += `\n\n[SYSTEM: RAG CONTEXT LOADED]\nThe following information is provided from the local knowledge base:\n${tools.rag.content.join('\n---\n')}\n`;
    }
    
    if (tools.mcp.active) {
      contextInjection += `\n\n[SYSTEM: MCP BRIDGE ACTIVE]\nConnected to local MCP server on port ${tools.mcp.port}.`;
    }

    if (tools.fetch.active) {
       contextInjection += `\n\n[SYSTEM: WEB FETCH]\n(Note: Local models cannot browse the web directly, but simulated context is: URL target ${tools.fetch.targetUrl || 'general'})`;
    }

    // Build messages array for Ollama
    const systemMsg = {
      role: 'system',
      content: getSystemInstruction(agent, projectSummary, currentTasks, suggestionLevel)
    };

    const recentHistory = history
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .slice(-10)
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));

    const userMsg = {
        role: 'user',
        content: contextInjection ? `${contextInjection}\n\nUSER REQUEST: ${prompt}` : prompt
    };

    const messages = [systemMsg, ...recentHistory, userMsg];
    const cleanUrl = baseUrl.replace(/\/$/, '');

    // Call Ollama API
    const response = await fetch(`${cleanUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: false, 
        options: {
            temperature: 0.7
        }
      })
    });

    if (!response.ok) {
        throw new Error(`Ollama API Error: ${response.status} ${response.statusText}. Ensure Ollama is running and OLLAMA_ORIGINS="*" is set.`);
    }

    const data: OllamaResponse = await response.json();
    let responseText = data.message.content;

    // Extract Suggested Agent Switch
    let suggestedAgent: AgentMode | undefined;
    const switchRegex = /\[\[SWITCH_TO:(.*?)\]\]/;
    const switchMatch = responseText.match(switchRegex);
    if (switchMatch) {
      const agentId = switchMatch[1].trim() as AgentMode;
      // Validate
      const validAgents = Object.values(AgentMode);
      if (validAgents.includes(agentId)) {
        suggestedAgent = agentId;
      }
      responseText = responseText.replace(switchMatch[0], '').trim();
    }

    return {
      text: responseText,
      suggestedAgent
    };

  } catch (error: any) {
    console.error("Ollama Service Error:", error);
    return {
      text: `[LOCAL KERNEL ERROR]: ${error.message || "Failed to connect to Ollama."}\n\nTip: Make sure Ollama is running and run 'launchctl setenv OLLAMA_ORIGINS "*"' or equivalent to allow browser requests.`
    };
  }
};
