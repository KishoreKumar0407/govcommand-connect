import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI Client
// The API key is assumed to be available in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const draftGovernmentMessage = async (topic: string, recipientName: string, priority: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key missing. Returning mock response.");
      return `[MOCK DRAFT] Official Directive regarding ${topic} for ${recipientName}. Please adhere to standard protocols immediately.`;
    }

    const prompt = `
      You are a government communications officer. 
      Draft a concise, formal, and authoritative message for a government official.
      
      Recipient: ${recipientName} (Constituency Officer)
      Priority Level: ${priority}
      Topic/Instruction: ${topic}
      
      The message should be direct, professional, and ready to send. Do not include placeholders.
      Max length: 50 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate draft.";
  } catch (error) {
    console.error("Error drafting message with Gemini:", error);
    return "System Error: Unable to draft message at this time.";
  }
};
