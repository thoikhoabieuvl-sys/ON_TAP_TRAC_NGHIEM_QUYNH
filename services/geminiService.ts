
import { GoogleGenAI, Type } from "@google/genai";

// Luôn khởi tạo instance AI ngay trước khi dùng để lấy API_KEY mới nhất
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const explainQuestion = async (question: string, options: string[], correctAnswer: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bạn là một giáo viên tận tâm. Hãy giải thích tại sao đáp án "${correctAnswer}" là đúng cho câu hỏi sau:
      Câu hỏi: ${question}
      Các lựa chọn: ${options.join(', ')}
      
      Yêu cầu:
      1. Giải thích ngắn gọn, súc tích (dưới 100 từ).
      2. Sử dụng ngôn ngữ thân thiện với học sinh.`,
    });
    return response.text || "AI không thể đưa ra lời giải thích lúc này.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Đã xảy ra lỗi khi kết nối với AI.";
  }
};

export const generateThoughtfulResponse = async (prompt: string, history: any[]) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });
    return response.text || "Không có phản hồi.";
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const generateImage = async (prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } },
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const analyzeData = async (input: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Phân tích dữ liệu sau và trích xuất JSON để vẽ biểu đồ: ${input}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              value: { type: Type.NUMBER },
            },
            required: ["name", "value"],
          },
        },
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
