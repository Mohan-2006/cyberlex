import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { CaseDetails } from "../types";

const API_KEY = process.env.API_KEY || '';

// System instruction for the Chatbot
const CHAT_SYSTEM_INSTRUCTION = `
You are CyberLex, an elite Cyber Law Assistant.
Your goal is to provide accurate guidance on cybersecurity laws (GDPR, CCPA, etc.) and digital rights.
IMPORTANT:
- Explain concepts simply. Assume the user is smart but not a lawyer.
- If a user asks a simple question, give a simple answer.
- Always be helpful and constructive.
Disclaimer: ALWAYS begin or end significant advice with a disclaimer that you are an AI and this does not constitute attorney-client privileged legal advice.
Format: Use Markdown for headers, lists, and emphasis.
`;

// System instruction for the Case Advisor
const ADVISOR_SYSTEM_INSTRUCTION = `
You are a friendly, supportive Cyber Incident Guide.
Your user is likely NOT a lawyer and might be stressed.
Your goal is to explain what to do in SIMPLE, PLAIN ENGLISH (5th-grade reading level).

RULES:
1. NO LEGAL JARGON. Do not use words like "liability", "indemnification", or "statute" without explaining them very simply.
2. Be CALM and REASSURING.
3. Focus on SAFETY FIRST.

OUTPUT FORMAT:
1. **Disclaimer**: "I am an AI, not a lawyer. This is just a guide to help you get started."
2. **What Happened**: A 1-sentence simple summary.
3. **Immediate Steps (Do This Now)**: 3-4 clear, urgent actions (e.g., "Change your password," "Call your bank," "Disconnect the computer").
4. **Simple Legal Check**: Explain if any major rules apply based on their location (e.g., "Since you are in California, you have the right to know...").
5. **Who to Tell**: A simple list (e.g., "Tell your customers," "Tell the police if money was stolen").

Tone: Helpful, simple, clear.
`;

class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  // General Chat with Streaming
  async *streamChatResponse(history: { role: string; parts: { text: string }[] }[], newMessage: string) {
    const chat: Chat = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history,
    });

    const result = await chat.sendMessageStream({ message: newMessage });
    
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield c.text;
      }
    }
  }

  // Complex Case Analysis using gemini-3-pro-preview for deeper reasoning
  async analyzeCase(details: CaseDetails): Promise<string> {
    const prompt = `
    I need a simple guide for a cyber problem. Please explain it to me like I am not a lawyer.
    
    **The Problem:** ${details.incidentType}
    **When:** ${details.incidentDate}
    **Where I am:** ${details.jurisdiction}
    **Who is involved:** ${details.affectedParties}
    
    **Story:**
    ${details.description}
    
    Please give me a simple step-by-step action plan. Don't use confusing words.
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for complex reasoning tasks
      contents: prompt,
      config: {
        systemInstruction: ADVISOR_SYSTEM_INSTRUCTION,
        temperature: 0.4, // Lower temperature for more analytical/factual output
      }
    });

    return response.text || "Unable to generate analysis at this time.";
  }
}

export const geminiService = new GeminiService();