import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateArabicQuote = async (topic: string): Promise<string> => {
  try {
    const ai = getClient();
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      You are a professional copywriter for a financial and investment magazine in the Middle East.
      Write a short, inspiring, and profound quote in Arabic about the following topic: "${topic}".
      The quote should be suitable for a poster design.
      Do not use Markdown. Do not add quotes (""). Just return the Arabic text.
      Keep it under 15 words.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text?.trim() || "فشل في إنشاء النص";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "الاستثمار في المعرفة يمنح أفضل الفوائد."; // Fallback
  }
};

export const generateImagePrompt = async (topic: string): Promise<string> => {
    try {
        const ai = getClient();
        const model = "gemini-3-flash-preview";
        
        const prompt = `Create a short, descriptive English prompt for an image generation model based on the abstract concept: "${topic}". 
        Focus on professional, business, photography style, moody lighting, grayscale compatible scenes. 
        Max 20 words.`;
    
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
    
        return response.text?.trim() || "business man writing notes close up";
      } catch (error) {
        return "business meeting professional";
      }
}
