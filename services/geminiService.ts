
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const explainQuestion = async (question: string, options: string[], correctAnswer: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Giải thích ngắn gọn và dễ hiểu tại sao trong câu hỏi trắc nghiệm sau đây, đáp án "${correctAnswer}" là chính xác.
    Câu hỏi: ${question}
    Các lựa chọn: ${options.join(', ')}
    Hãy giải thích theo phong cách giáo viên đang giảng bài cho học sinh trung học.`,
    config: {
      temperature: 0.5,
    }
  });
  return response.text || 'Không thể lấy lời giải thích lúc này.';
};

export const generateThoughtfulResponse = async (prompt: string, history: { role: string, parts: { text: string }[] }[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      ...history.map(h => ({ role: h.role === 'model' ? 'model' : 'user', parts: [{ text: h.parts[0].text }] })),
      { role: 'user', parts: [{ text: prompt }] }
    ],
    config: {
      thinkingConfig: { thinkingBudget: 16000 },
      temperature: 0.7,
    }
  });
  return response.text || '';
};

export const generateImage = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error('No image generated');
};

export const analyzeData = async (dataDescription: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this data or request and return a JSON array of objects suitable for a Recharts bar or line chart. Each object should have a 'name' field and at least one numeric value field. Request: ${dataDescription}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            value: { type: Type.NUMBER },
            secondaryValue: { type: Type.NUMBER }
          },
          required: ["name", "value"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
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
