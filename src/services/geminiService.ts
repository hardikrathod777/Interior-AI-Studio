import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { getCookie } from "../lib/utils";

const API_KEY_COOKIE = "geminiApiKey";

function getGeminiApiKey(): string {
  const apiKey = getCookie(API_KEY_COOKIE);
  if (!apiKey) {
    throw new Error("Missing Gemini API key. Please configure your API key before using the app.");
  }
  return apiKey;
}

function createGeminiClient() {
  return new GoogleGenAI({ apiKey: getGeminiApiKey() });
}

export interface DesignStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export const DESIGN_STYLES: DesignStyle[] = [
  {
    id: "scandinavian",
    name: "Scandinavian",
    description: "Minimalist, functional, and cozy with light woods and neutral tones.",
    prompt: "Reimagine this room in a Scandinavian style. Use light-colored wood, minimalist furniture, neutral color palette (whites, grays, beiges), and cozy textures like wool or sheepskin. Ensure the layout remains similar but the aesthetic is clean and bright.",
  },
  {
    id: "mid-century",
    name: "Mid-Century Modern",
    description: "Retro charm with clean lines, organic shapes, and warm wood tones.",
    prompt: "Reimagine this room in a Mid-Century Modern style. Use iconic furniture shapes, tapered legs, warm teak or walnut wood, and a mix of organic and geometric patterns. Add pops of mustard yellow, olive green, or burnt orange.",
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "Raw and edgy with exposed brick, metal accents, and reclaimed wood.",
    prompt: "Reimagine this room in an Industrial style. Incorporate exposed brick walls, metal light fixtures, dark wood accents, and leather furniture. The vibe should be raw, urban, and sophisticated.",
  },
  {
    id: "bohemian",
    name: "Bohemian",
    description: "Eclectic and vibrant with layers of patterns, plants, and textures.",
    prompt: "Reimagine this room in a Bohemian style. Use vibrant colors, layered rugs, plenty of indoor plants, macrame wall hangings, and eclectic furniture. The space should feel lived-in, artistic, and cozy.",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Ultra-clean and serene with essential pieces and lots of open space.",
    prompt: "Reimagine this room in a Minimalist style. Remove all clutter, use a monochromatic color scheme, and keep only essential, high-quality furniture pieces. Focus on clean lines and a sense of calm and space.",
  },
];

function parseJsonMessage(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function parseGeminiError(error: unknown): string {
  if (!error) return "An unknown error occurred. Please try again.";

  if (typeof error === "string") {
    const parsed = parseJsonMessage(error);
    if (typeof parsed !== "string") return parseGeminiError(parsed);
    return parsed;
  }
  if (error instanceof Error) {
    const parsed = parseJsonMessage(error.message);
    if (typeof parsed !== "string") return parseGeminiError(parsed);
    return error.message;
  }

  const errObj = error as Record<string, any>;
  if (typeof errObj.message === "string") {
    const parsed = parseJsonMessage(errObj.message);
    if (typeof parsed !== "string") return parseGeminiError(parsed);
    return errObj.message;
  }

  const apiError = errObj.error || errObj.response?.data || errObj;
  if (apiError) {
    if (typeof apiError === "string") {
      return parseGeminiError(apiError);
    }
    if (typeof apiError.message === "string") {
      return parseGeminiError(apiError.message);
    }
    if (Array.isArray(apiError.details)) {
      for (const detail of apiError.details) {
        if (detail?.message) return parseGeminiError(detail.message);
        if (detail?.localizedMessage?.message) return parseGeminiError(detail.localizedMessage.message);
      }
    }
    if (apiError.error && typeof apiError.error === "string") {
      return parseGeminiError(apiError.error);
    }
  }

  return "Failed to communicate with Gemini. Please check your API key and try again.";
}

export async function generateReimaginedImage(
  base64Image: string,
  stylePrompt: string,
  mimeType: string = "image/jpeg"
): Promise<string> {
  try {
    const ai = createGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(",")[1] || base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: stylePrompt,
          },
        ],
      },
    });

    const contentParts = response?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(contentParts)) {
      throw new Error("No image data returned from Gemini");
    }

    for (const part of contentParts) {
      if (part?.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from Gemini");
  } catch (error) {
    const message = parseGeminiError(error);
    console.error("Error generating image:", error);
    throw new Error(message);
  }
}

export async function chatAboutDesign(
  message: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  currentImageBase64?: string
): Promise<GenerateContentResponse> {
  const model = "gemini-3.1-pro-preview";
  
  const contents: any[] = [...history];
  
  const currentPart: any[] = [{ text: message }];
  
  if (currentImageBase64) {
    currentPart.push({
      inlineData: {
        data: currentImageBase64.split(",")[1] || currentImageBase64,
        mimeType: "image/jpeg",
      },
    });
  }

  contents.push({ role: "user", parts: currentPart });

  const ai = createGeminiClient();

  try {
    return await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: "You are an expert Interior Design Consultant. You help users refine their room designs. When users ask for changes, provide professional advice and describe how the changes would look. Always include shoppable links or descriptions of items (e.g., 'You can find similar minimalist rugs at IKEA or West Elm'). Be encouraging and creative.",
      },
    });
  } catch (error) {
    const message = parseGeminiError(error);
    console.error("Error generating chat response:", error);
    throw new Error(message);
  }
}
