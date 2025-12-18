
export enum AppTab {
  DASHBOARD = 'dashboard',
  WRITER = 'writer',
  IMAGE_GEN = 'image_gen',
  VOICE = 'voice',
  DATA_VIZ = 'data_viz',
  QUIZ_LAB = 'quiz_lab'
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizCategory {
  id: string;
  title: string;
  icon: string;
  questions: Question[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  thinking?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}
