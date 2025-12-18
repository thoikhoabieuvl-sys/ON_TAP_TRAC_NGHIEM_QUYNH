
import React, { useState } from 'react';
import { QuizCategory } from '../types';
import { explainQuestion } from '../services/geminiService';

const SAMPLE_QUIZZES: QuizCategory[] = [
  {
    id: 'history',
    title: 'Lịch Sử Việt Nam',
    description: 'Ôn tập về các triều đại và cuộc kháng chiến bảo vệ tổ quốc.',
    icon: 'fa-book-history',
    questions: [
      { id: 1, question: 'Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng vào năm nào?', options: ['Năm 905', 'Năm 931', 'Năm 938', 'Năm 981'], correctAnswer: 2 },
      { id: 2, question: 'Vị vua nào của triều đại nhà Trần đã hai lần sang làm Thái thượng hoàng?', options: ['Trần Thánh Tông', 'Trần Nhân Tông', 'Trần Anh Tông', 'Trần Minh Tông'], correctAnswer: 1 },
      { id: 3, question: 'Chiến thắng Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" diễn ra vào năm nào?', options: ['1945', '1954', '1960', '1975'], correctAnswer: 1 }
    ]
  },
  {
    id: 'science',
    title: 'Khoa Học Tự Nhiên',
    description: 'Các kiến thức cơ bản về sinh học, vật lý và hóa học.',
    icon: 'fa-flask',
    questions: [
      { id: 1, question: 'Chất nào chiếm khoảng 78% bầu khí quyển của Trái Đất?', options: ['Oxy', 'Cacbonic', 'Nitơ', 'Hydro'], correctAnswer: 2 },
      { id: 2, question: 'Cơ quan nào trong cơ thể con người chịu trách nhiệm lọc máu?', options: ['Tim', 'Thận', 'Gan', 'Phổi'], correctAnswer: 1 },
      { id: 3, question: 'Nhiệt độ sôi của nước tinh khiết ở áp suất tiêu chuẩn là bao nhiêu?', options: ['90 độ C', '100 độ C', '110 độ C', '120 độ C'], correctAnswer: 1 }
    ]
  }
];

const QuizLab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showEnd, setShowEnd] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const currentQ = selectedCategory?.questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
  };

  const checkAnswer = () => {
    if (selectedIdx === null) return;
    setIsAnswered(true);
    if (selectedIdx === currentQ?.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setExplanation(null);
    if (currentIndex < (selectedCategory?.questions.length || 0) - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      setShowEnd(true);
    }
  };

  const getAIExplanation = async () => {
    if (!currentQ) return;
    setLoadingAI(true);
    try {
      const res = await explainQuestion(
        currentQ.question,
        currentQ.options,
        currentQ.options[currentQ.correctAnswer]
      );
      setExplanation(res);
    } catch (e) {
      setExplanation("Xin lỗi, tôi không thể lấy lời giải lúc này.");
    } finally {
      setLoadingAI(false);
    }
  };

  if (!selectedCategory) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Danh mục ôn tập</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_QUIZZES.map(q => (
            <button
              key={q.id}
              onClick={() => setSelectedCategory(q)}
              className="bg-white p-8 rounded-3xl border border-slate-200 text-left hover:border-emerald-500 transition-all custom-shadow group"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-100">
                <i className={`fas ${q.icon} text-xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{q.title}</h3>
              <p className="text-slate-500 text-sm">{q.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showEnd) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Kết quả ôn tập</h2>
        <p className="text-2xl text-emerald-600 font-bold mb-8">Bạn đúng {score}/{selectedCategory.questions.length} câu!</p>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setCurrentIndex(0);
            setScore(0);
            setShowEnd(false);
            setIsAnswered(false);
            setSelectedIdx(null);
          }}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold"
        >
          Quay lại danh mục
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => setSelectedCategory(null)} className="text-slate-500 hover:text-slate-800 font-bold">
          <i className="fas fa-arrow-left mr-2"></i> Trở về
        </button>
        <span className="text-sm font-bold text-slate-400">Câu {currentIndex + 1} / {selectedCategory.questions.length}</span>
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-100 custom-shadow mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-10 leading-relaxed">{currentQ?.question}</h3>
        
        <div className="space-y-4">
          {currentQ?.options.map((opt, idx) => {
            let style = "border-slate-100 bg-slate-50 text-slate-700";
            if (isAnswered) {
              if (idx === currentQ.correctAnswer) style = "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold";
              else if (idx === selectedIdx) style = "border-red-500 bg-red-50 text-red-700 font-bold";
            } else if (idx === selectedIdx) {
              style = "border-emerald-600 bg-emerald-50 text-emerald-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full p-5 rounded-2xl border-2 text-left flex items-center transition-all ${style}`}
              >
                <span className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center mr-4 text-sm font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-10 pt-10 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-lightbulb text-amber-500"></i> Lời giải từ AI
              </h4>
              {!explanation && (
                <button 
                  onClick={getAIExplanation}
                  className="text-xs bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
                >
                  {loadingAI ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-robot mr-2"></i>}
                  Nhờ AI giải thích
                </button>
              )}
            </div>
            {explanation && (
              <p className="text-slate-600 bg-slate-50 p-6 rounded-2xl leading-relaxed text-sm whitespace-pre-wrap">
                {explanation}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {!isAnswered ? (
          <button
            onClick={checkAnswer}
            disabled={selectedIdx === null}
            className="flex-1 bg-emerald-600 text-white py-5 rounded-2xl font-bold text-xl disabled:opacity-50 shadow-lg shadow-emerald-600/10"
          >
            Kiểm tra đáp án
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-bold text-xl shadow-lg shadow-slate-900/10"
          >
            Tiếp tục <i className="fas fa-chevron-right ml-2"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizLab;
