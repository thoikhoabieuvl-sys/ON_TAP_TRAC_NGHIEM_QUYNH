
import React, { useState, useEffect } from 'react';
import { QuizCategory, Question } from '../types';
import { explainQuestion } from '../services/geminiService';

const SAMPLE_QUIZZES: QuizCategory[] = [
  {
    id: 'history',
    title: 'Lịch Sử Việt Nam',
    icon: 'fa-scroll',
    questions: [
      { id: 1, question: 'Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng vào năm nào?', options: ['905', '931', '938', '981'], correctAnswer: 2 },
      { id: 2, question: 'Ai là người đọc bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa?', options: ['Võ Nguyên Giáp', 'Hồ Chí Minh', 'Trường Chinh', 'Phạm Văn Đồng'], correctAnswer: 1 },
      { id: 3, question: 'Chiến dịch Điện Biên Phủ kết thúc vào ngày tháng năm nào?', options: ['7/5/1954', '30/4/1975', '2/9/1945', '19/12/1946'], correctAnswer: 0 }
    ]
  },
  {
    id: 'geography',
    title: 'Địa Lý Thế Giới',
    icon: 'fa-earth-asia',
    questions: [
      { id: 1, question: 'Quốc gia nào có diện tích lớn nhất thế giới?', options: ['Mỹ', 'Trung Quốc', 'Nga', 'Canada'], correctAnswer: 2 },
      { id: 2, question: 'Sông nào dài nhất thế giới?', options: ['Sông Amazon', 'Sông Nile', 'Sông Mê Kông', 'Sông Trường Giang'], correctAnswer: 1 },
      { id: 3, question: 'Châu lục nào lạnh nhất trên Trái đất?', options: ['Châu Âu', 'Châu Mỹ', 'Châu Á', 'Châu Nam Cực'], correctAnswer: 3 }
    ]
  }
];

const QuizLab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const currentQuestion = selectedCategory?.questions[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (isConfirmed) return;
    setSelectedOption(index);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    setIsConfirmed(true);
    if (selectedOption === currentQuestion?.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setAiExplanation(null);
    if (currentQuestionIndex < (selectedCategory?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsConfirmed(false);
    } else {
      setShowResult(true);
    }
  };

  const handleAskAI = async () => {
    if (!currentQuestion) return;
    setIsExplaining(true);
    try {
      const explanation = await explainQuestion(
        currentQuestion.question,
        currentQuestion.options,
        currentQuestion.options[currentQuestion.correctAnswer]
      );
      setAiExplanation(explanation);
    } catch (error) {
      setAiExplanation("Có lỗi xảy ra khi gọi trợ lý AI.");
    } finally {
      setIsExplaining(false);
    }
  };

  const resetQuiz = () => {
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsConfirmed(false);
    setScore(0);
    setShowResult(false);
    setAiExplanation(null);
  };

  if (!selectedCategory) {
    return (
      <div className="py-8 animate-in fade-in duration-700">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Phòng Ôn Tập Trắc Nghiệm
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Chọn một chủ đề để bắt đầu luyện tập kiến thức. Tích hợp AI để giải thích chi tiết từng câu hỏi.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_QUIZZES.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => setSelectedCategory(quiz)}
              className="group glass p-8 rounded-3xl text-left hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-2xl mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                <i className={`fas ${quiz.icon}`}></i>
              </div>
              <h3 className="text-2xl font-bold mb-2">{quiz.title}</h3>
              <p className="text-slate-500 mb-6">{quiz.questions.length} câu hỏi ôn tập</p>
              <span className="text-indigo-400 font-semibold">Bắt đầu ngay <i className="fas fa-arrow-right ml-2"></i></span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-4xl mb-6">
          <i className="fas fa-trophy"></i>
        </div>
        <h2 className="text-4xl font-bold mb-2">Hoàn thành!</h2>
        <p className="text-xl text-slate-400 mb-8">Bạn đã trả lời đúng {score}/{selectedCategory.questions.length} câu hỏi.</p>
        <button
          onClick={resetQuiz}
          className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-bold transition-all"
        >
          Quay lại danh mục
        </button>
      </div>
    );
  }

  return (
    <div className="py-4 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button onClick={resetQuiz} className="text-slate-400 hover:text-white transition-colors">
          <i className="fas fa-chevron-left mr-2"></i> Thoát
        </button>
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-slate-500">
            CÂU {currentQuestionIndex + 1}/{selectedCategory.questions.length}
          </div>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500" 
              style={{ width: `${((currentQuestionIndex + 1) / selectedCategory.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex-1 glass rounded-3xl p-8 mb-6 overflow-y-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-tight">
          {currentQuestion?.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion?.options.map((option, idx) => {
            let borderClass = "border-slate-800 bg-slate-900/50";
            let icon = null;

            if (isConfirmed) {
              if (idx === currentQuestion.correctAnswer) {
                borderClass = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
                icon = <i className="fas fa-check-circle ml-auto"></i>;
              } else if (idx === selectedOption) {
                borderClass = "border-red-500 bg-red-500/10 text-red-400";
                icon = <i className="fas fa-times-circle ml-auto"></i>;
              }
            } else if (idx === selectedOption) {
              borderClass = "border-indigo-500 bg-indigo-500/10 text-indigo-400";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full flex items-center p-5 rounded-2xl border-2 transition-all text-left ${borderClass}`}
              >
                <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-4 font-bold text-sm">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-lg">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {isConfirmed && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-indigo-400 flex items-center gap-2">
                  <i className="fas fa-lightbulb"></i> Giải thích từ AI
                </h4>
                {!aiExplanation && (
                  <button 
                    onClick={handleAskAI}
                    disabled={isExplaining}
                    className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-1.5 rounded-lg font-bold transition-all disabled:opacity-50"
                  >
                    {isExplaining ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-robot mr-2"></i>}
                    Xem giải thích
                  </button>
                )}
              </div>
              {aiExplanation && (
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {aiExplanation}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {!isConfirmed ? (
          <button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-4 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-indigo-600/20"
          >
            Xác nhận đáp án
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-emerald-600/20"
          >
            {currentQuestionIndex < selectedCategory.questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'} <i className="fas fa-arrow-right ml-2"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizLab;
