
export enum AppTab {
  DASHBOARD = 'trang_chu',
  QUIZ_LAB = 'on_tap'
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}
