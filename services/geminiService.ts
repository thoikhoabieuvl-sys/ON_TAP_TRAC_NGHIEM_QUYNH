
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Hàm lấy API Key an toàn
 */
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

/**
 * Giải thích câu hỏi trắc nghiệm sử dụng Gemini Flash.
 */
export const explainQuestion = async (question: string, options: string[], correctAnswer: string) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return "Lỗi: Hệ thống chưa cấu hình API Key. Vui lòng kiểm tra lại cài đặt môi trường.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bạn là một giáo viên tận tâm. Hãy giải thích tại sao đáp án "${correctAnswer}" là đúng cho câu hỏi sau:
      Câu hỏi: ${question}
      Các lựa chọn: ${options.join(', ')}
      
      Yêu cầu:
      1. Giải thích ngắn gọn, dễ hiểu cho học sinh.
      2. Sử dụng tiếng Việt.
      3. Trình bày thân thiện.`,
    });
    
    return response.text || "AI không thể đưa ra lời giải thích lúc này.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Đã xảy ra lỗi khi kết nối với trợ lý AI. Vui lòng thử lại sau.";
  }
};

/**
 * Tạo câu trả lời có suy luận sâu sắc sử dụng Gemini 3 Pro Reasoning.
 */
export const generateThoughtfulResponse = async (prompt: string, history: any[]) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");
  
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text || "Không có phản hồi từ AI.";
  } catch (error) {
    console.error("Thoughtful Response Error:", error);
    throw error;
  }
};

/**
 * Tạo hình ảnh từ mô tả văn bản sử dụng gemini-2.5-flash-image.
 */
export const generateImage = async (prompt: string) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Không tìm thấy dữ liệu hình ảnh trong phản hồi.");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

/**
 * Phân tích văn bản và trích xuất dữ liệu JSON để vẽ biểu đồ.
 */
export const analyzeData = async (input: string) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Phân tích dữ liệu sau và trích xuất các thông tin quan trọng để vẽ biểu đồ. 
      Dữ liệu: ${input}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: 'Tên nhãn hoặc mốc thời gian',
              },
              value: {
                type: Type.NUMBER,
                description: 'Giá trị số chính',
              },
              secondaryValue: {
                type: Type.NUMBER,
                description: 'Giá trị số phụ (nếu có)',
              },
            },
            required: ["name", "value"],
          },
        },
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Data Analysis Error:", error);
    throw error;
  }
};

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

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
