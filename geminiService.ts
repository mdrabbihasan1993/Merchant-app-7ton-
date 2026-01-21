
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const analyzeBusinessPerformance = async (context: string): Promise<string> => {
  const ai = getAIClient();
  const systemInstruction = "You are a Senior Business Consultant for 7ton Express, an express delivery company. Analyze the logistics data and provide 3 short, actionable, bulleted points to improve business. Keep it professional, motivating, and concise.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: ${context}. Prompt: Based on these merchant logistics stats, give 3 short, actionable bullet points to improve business.`,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });
    return response.text || "No insights available at the moment.";
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "I'm currently recalibrating my analytical engine. Please try again in a moment.";
  }
};

export const checkFraudRisk = async (phoneNumber: string): Promise<string> => {
  const ai = getAIClient();
  const systemInstruction = "You are a Security Specialist checking for fake customers in the Bangladesh logistics market. Analyze historical delivery risk for the given phone number.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this phone number for potential delivery risk in Bangladesh: ${phoneNumber}. Provide a risk score from 1-10 (1 is safe) and a very short reasoning.`,
      config: {
        systemInstruction,
        temperature: 0.1,
      }
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("AI Fraud Check Error:", error);
    return "Error connecting to the security database. Please verify manually.";
  }
};
