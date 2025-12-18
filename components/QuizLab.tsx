
import React, { useState } from 'react';
import { QuizCategory } from '../types';
import { explainQuestion } from '../services/geminiService';

const SAMPLE_QUIZZES: QuizCategory[] = [
  {
    id: 'history',
    title: 'Lịch Sử Việt Nam',
    description: 'Ôn tập kiến thức lịch sử phổ thông.',
    icon: 'fa-landmark',
    questions: [
      { id: 1, question: 'Vị vua nào đã đặt tên nước ta là Vạn Xuân?', options: ['Lý Nam Đế', 'Ngô Quyền', 'Đinh Tiên Hoàng', 'Lê Hoàn'], correctAnswer: 0 },
      { id: 2, question: 'Cuộc khởi nghĩa Hai Bà Trưng diễn ra vào năm nào?', options: ['Năm 40', 'Năm 938', 'Năm 1789', 'Năm 1945'], correctAnswer: 0 },
      { id: 3, question: 'Bác Hồ đọc bản Tuyên ngôn Độc lập tại đâu?', options: ['Quảng trường Ba Đình', 'Dinh Độc Lập', 'Bến Nhà Rồng', 'Pác Bó'], correctAnswer: 0 }
    ]
  },
  {
    id: 'nature',
    title: 'Khoa Học Tự Nhiên',
    description: 'Kiến thức về thế giới xung quanh chúng ta.',
    icon: 'fa-leaf',
    questions: [
      { id: 1, question: 'Nhiệt độ sôi của nước ở điều kiện thường là bao nhiêu?', options: ['90°C', '100°C', '110°C', '120°C'], correctAnswer: 1 },
      { id: 2, question: 'Hành tinh nào gần Mặt trời nhất?', options: ['Sao Kim', 'Sao Hỏa', 'Sao Thủy', 'Trái Đất'], correctAnswer: 2 },
      { id: 3, question: 'Con người hít khí gì để duy trì sự sống?', options: ['Khí Nitơ', 'Khí Oxy', 'Khí Hydro', 'Khí Cacbonic'], correctAnswer: 1 }
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

  const handleFinish = () => {
    setIsFinished(true);
  };

  const handleNext = () => {
    setAiText(null);
    if (qIdx < (selectedCat?.questions.length || 0) - 1) {
      setQIdx(qIdx + 1);
      setUserChoice(null);
      setIsLocked(false);
    } else {
      handleFinish();
    }
  };

  const checkAnswer = () => {
    if (userChoice === null) return;
    setIsLocked(true);
    if (userChoice === currentQ?.correctAnswer) {
      setScore(score + 1);
    }
  };

  const getHelp = async () => {
    if (!currentQ) return;
    setIsThinking(true);
    try {
      const res = await explainQuestion(
        currentQ.question,
        currentQ.options,
        currentQ.options[currentQ.correctAnswer]
      );
      setAiText(res);
    } catch (e) {
      setAiText("Có lỗi khi kết nối với AI. Vui lòng thử lại.");
    } finally {
      setIsThinking(false);
    }
  };

  if (!selectedCat) {
    return (
      <div className="py-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Chọn môn học</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SAMPLE_QUIZZES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat)}
              className="bg-white p-6 rounded-2xl border border-slate-200 text-left hover:border-blue-500 transition-all hover:shadow-md"
            >
              <i className={`fas ${cat.icon} text-blue-600 text-2xl mb-4`}></i>
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
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in zoom-in duration-300">
        <div className="text-6xl mb-6">🏆</div>
        <h2 className="text-3xl font-bold mb-2">Chúc mừng bạn!</h2>
        <p className="text-slate-500 text-xl mb-8">Bạn đã đúng {score}/{selectedCat.questions.length} câu.</p>
        <button
          onClick={() => {
            setSelectedCat(null);
            setQIdx(0);
            setScore(0);
            setIsFinished(false);
            setUserChoice(null);
            setIsLocked(false);
          }}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold"
        >
          Làm lại môn khác
        </button>
      </div>
    );
  }

  return (
    <div className="py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setSelectedCat(null)} className="text-slate-400 font-bold hover:text-slate-800 transition-colors">
          <i className="fas fa-chevron-left mr-2"></i> Thoát
        </button>
        <div className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest">
          {selectedCat.title}
        </div>
        <div className="text-sm font-bold text-slate-400">Câu {qIdx + 1}/{selectedCat.questions.length}</div>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
          {currentQ?.question}
        </h3>

        <div className="space-y-3">
          {currentQ?.options.map((opt, idx) => {
            let colorClass = "border-slate-100 bg-slate-50 text-slate-700 hover:border-blue-200";
            if (isLocked) {
              if (idx === currentQ.correctAnswer) {
                colorClass = "border-green-500 bg-green-50 text-green-700 font-bold";
              } else if (idx === userChoice) {
                colorClass = "border-red-500 bg-red-50 text-red-700";
              }
            } else if (idx === userChoice) {
              colorClass = "border-blue-600 bg-blue-50 text-blue-700 font-bold";
            }

            return (
              <button
                key={idx}
                disabled={isLocked}
                onClick={() => setUserChoice(idx)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${colorClass}`}
              >
                <span className="font-bold mr-3">{String.fromCharCode(65 + idx)}.</span> {opt}
              </button>
            );
          })}
        </div>

        {isLocked && (
          <div className="mt-8 pt-8 border-t border-slate-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">Góc trợ giúp AI</span>
              {!aiText && (
                <button 
                  onClick={getHelp} 
                  disabled={isThinking}
                  className="text-xs bg-slate-800 text-white px-3 py-2 rounded-lg font-bold hover:bg-slate-700 disabled:opacity-50"
                >
                  {isThinking ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-robot mr-2"></i>}
                  Giải thích cho em
                </button>
              )}
            </div>
            {aiText && (
              <div className="p-4 bg-amber-50 rounded-xl text-slate-700 text-sm leading-relaxed border border-amber-100">
                {aiText}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        {!isLocked ? (
          <button
            onClick={checkAnswer}
            disabled={userChoice === null}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-100 disabled:opacity-50 transition-all"
          >
            Kiểm tra đáp án
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-slate-200 transition-all"
          >
            {qIdx < selectedCat.questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'} <i className="fas fa-arrow-right ml-2"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizLab;
