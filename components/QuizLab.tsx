
import React, { useState } from 'react';
import { QuizCategory } from '../types.ts';
import { explainQuestion } from '../services/geminiService.ts';

const SAMPLE_QUIZZES: QuizCategory[] = [
  {
    id: 'history',
    title: 'Lịch Sử Việt Nam',
    description: 'Kiến thức lịch sử phổ thông Việt Nam.',
    icon: 'fa-landmark',
    questions: [
      { id: 1, question: 'Vị vua nào đã đặt tên nước ta là Vạn Xuân?', options: ['Lý Nam Đế', 'Ngô Quyền', 'Đinh Tiên Hoàng', 'Lê Hoàn'], correctAnswer: 0 },
      { id: 2, question: 'Thành phố nào được gọi là Thành phố Hoa Phượng Đỏ?', options: ['Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'], correctAnswer: 2 },
      { id: 3, question: 'Ai là người đọc bản Tuyên ngôn Độc lập năm 1945?', options: ['Võ Nguyên Giáp', 'Hồ Chí Minh', 'Trần Phú', 'Lê Hồng Phong'], correctAnswer: 1 }
    ]
  },
  {
    id: 'geo',
    title: 'Địa Lý Việt Nam',
    description: 'Địa lý các vùng miền đất nước.',
    icon: 'fa-earth-asia',
    questions: [
      { id: 1, question: 'Đỉnh núi nào cao nhất Việt Nam?', options: ['Fansipan', 'Ba Vì', 'Yên Tử', 'Mẫu Sơn'], correctAnswer: 0 },
      { id: 2, question: 'Sông nào dài nhất chảy qua lãnh thổ Việt Nam?', options: ['Sông Hồng', 'Sông Đồng Nai', 'Sông Mê Kông', 'Sông Đà'], correctAnswer: 2 }
    ]
  }
];

const QuizLab: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<QuizCategory | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [userChoice, setUserChoice] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const currentQ = selectedCat?.questions[qIdx];

  const checkAnswer = () => {
    if (userChoice === null) return;
    setIsLocked(true);
    if (userChoice === currentQ?.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setAiText(null);
    if (qIdx < (selectedCat?.questions.length || 0) - 1) {
      setQIdx(qIdx + 1);
      setUserChoice(null);
      setIsLocked(false);
    } else {
      setIsFinished(true);
    }
  };

  const getHelp = async () => {
    if (!currentQ) return;
    setIsThinking(true);
    const res = await explainQuestion(currentQ.question, currentQ.options, currentQ.options[currentQ.correctAnswer]);
    setAiText(res);
    setIsThinking(false);
  };

  if (!selectedCat) {
    return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Chọn môn học ôn tập</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SAMPLE_QUIZZES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat)}
              className="quiz-card p-6 text-left hover:scale-[1.02] transition-all hover:border-blue-400 group"
            >
              <i className={`fas ${cat.icon} text-blue-600 text-3xl mb-4 group-hover:scale-110 transition-transform`}></i>
              <h3 className="font-bold text-lg mb-1">{cat.title}</h3>
              <p className="text-slate-500 text-sm">{cat.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="text-center py-16 quiz-card animate-in zoom-in duration-300">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-3xl font-bold mb-2 text-slate-900">Hoàn thành!</h2>
        <p className="text-slate-500 text-xl mb-8">Kết quả của bạn: <span className="text-blue-600 font-bold">{score}/{selectedCat.questions.length}</span></p>
        <button
          onClick={() => { setSelectedCat(null); setQIdx(0); setScore(0); setIsFinished(false); setUserChoice(null); setIsLocked(false); }}
          className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
        >
          Làm môn khác
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6 px-2">
        <button onClick={() => setSelectedCat(null)} className="text-slate-400 font-bold hover:text-blue-600 transition-colors">
          <i className="fas fa-arrow-left mr-2"></i> Quay lại
        </button>
        <div className="text-sm font-bold text-slate-400">Câu {qIdx + 1}/{selectedCat.questions.length}</div>
      </div>

      <div className="quiz-card p-6 md:p-10">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug">
          {currentQ?.question}
        </h3>

        <div className="space-y-3">
          {currentQ?.options.map((opt, idx) => {
            let colorClass = "border-slate-100 bg-slate-50 text-slate-700";
            if (isLocked) {
              if (idx === currentQ.correctAnswer) colorClass = "border-green-500 bg-green-50 text-green-700 font-bold ring-2 ring-green-200";
              else if (idx === userChoice) colorClass = "border-red-400 bg-red-50 text-red-600 ring-2 ring-red-100";
            } else if (idx === userChoice) {
              colorClass = "border-blue-500 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-100";
            }

            return (
              <button
                key={idx}
                disabled={isLocked}
                onClick={() => setUserChoice(idx)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${colorClass}`}
              >
                <span className="inline-block w-8 font-bold">{String.fromCharCode(65 + idx)}.</span> {opt}
              </button>
            );
          })}
        </div>

        {isLocked && (
          <div className="mt-8 pt-8 border-t border-slate-50 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Trợ giúp từ AI</span>
              {!aiText && (
                <button 
                  onClick={getHelp} 
                  disabled={isThinking}
                  className="text-xs bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50"
                >
                  {isThinking ? <i className="fas fa-circle-notch fa-spin mr-2"></i> : <i className="fas fa-robot mr-2"></i>}
                  Tại sao câu này đúng?
                </button>
              )}
            </div>
            {aiText && (
              <div className="p-4 bg-blue-50 text-blue-900 rounded-xl text-sm leading-relaxed border border-blue-100">
                {aiText}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        {!isLocked ? (
          <button
            onClick={checkAnswer}
            disabled={userChoice === null}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200 disabled:opacity-50 hover:bg-blue-700 transition-all"
          >
            Kiểm tra đáp án
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
          >
            {qIdx < selectedCat.questions.length - 1 ? 'Câu tiếp theo' : 'Xem tổng kết'} <i className="fas fa-arrow-right ml-2"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizLab;
