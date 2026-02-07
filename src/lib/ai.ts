import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function generateMetadata(content: string) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest" 
    });

    const prompt = `
      You are a strict classification engine. Analyze the content below and return a JSON object.
      
      RULES FOR "type":
      - "LINK": If the content contains a URL (http/https) or refers to a specific article/video.
      - "INSIGHT": If the content is a personal realization, philosophical thought, or "Aha!" moment.
      - "NOTE": Default for factual information, meeting notes, or code snippets.
      
      Input Content: "${content}"
      
      Required JSON Format:
      {
        "summary": "One short sentence summary",
        "tags": ["tag1", "tag2", "tag3"],
        "type": "NOTE" or "LINK" or "INSIGHT" 
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);

  } catch (error) {
    console.error("AI Generation Failed:", error);
    return { 
      summary: "AI processing skipped.", 
      tags: ["Manual"], 
      type: "NOTE" 
    };
  }
}