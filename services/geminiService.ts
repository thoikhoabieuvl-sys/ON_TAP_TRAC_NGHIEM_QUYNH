
import { GoogleGenAI, Type } from "@google/genai";

// Manual base64 encoding as required by guidelines for Live API
export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Manual base64 decoding as required by guidelines for Live API
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM audio data into an AudioBuffer.
 * This implements the manual decoding logic required for streaming raw audio chunks.
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Explains a quiz question using Gemini Flash.
 */
export const explainQuestion = async (question: string, options: string[], correctAnswer: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Giải thích ngắn gọn, dễ hiểu tại sao đáp án "${correctAnswer}" là đúng.
      Câu hỏi: ${question}
      Lựa chọn: ${options.join(', ')}
      Giải thích bằng tiếng Việt cho học sinh.`,
    });
    return response.text || "AI không trả về kết quả.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Đã xảy ra lỗi khi kết nối với AI.";
  }
};

/**
 * Generates a thoughtful response using Gemini Pro with reasoning enabled.
 */
export const generateThoughtfulResponse = async (prompt: string, history: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      },
      history: history
    });
    const response = await chat.sendMessage({ message: prompt });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Thinking Error:", error);
    throw error;
  }
};

/**
 * Generates an image using Gemini Flash Image.
 */
export const generateImage = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ text: prompt }],
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });
    
    // Iterate parts to find the image part
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response.");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};

/**
 * Analyzes text to extract numerical data for charting using structured JSON output.
 */
export const analyzeData = async (input: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract numerical data for visualization. Input: ${input}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Label for the data point" },
              value: { type: Type.NUMBER, description: "Primary numerical value" },
              secondaryValue: { type: Type.NUMBER, description: "Optional secondary numerical value" }
            },
            required: ["name", "value"],
            propertyOrdering: ["name", "value", "secondaryValue"]
          }
        }
      }
    });
    const result = response.text || "[]";
    return JSON.parse(result);
  } catch (error) {
    console.error("Gemini Data Analysis Error:", error);
    throw error;
  }
};
