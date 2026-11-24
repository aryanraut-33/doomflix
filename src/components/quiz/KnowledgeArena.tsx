import React, { useState, useEffect, useMemo } from 'react';
import { 
  HelpCircle, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  Flame, 
  Award, 
  ChevronRight, 
  ArrowRight,
  BookOpen,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS, QUIZ_CATEGORIES, QuizQuestion } from '../../data/quizBank';
import { useAppStore } from '../../services/store';

export const KnowledgeArena: React.FC = () => {
  const { watchProgress, isEpisodeWatched, recordQuizAttempt } = useAppStore();

  // Screen State: 'lobby' | 'playing' | 'results'
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'results'>('lobby');

  // Configuration
  const [quizMode, setQuizMode] = useState<'watched_only' | 'full_collection'>('watched_only');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [difficulty, setDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'expert'>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);

  // Active Play State
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(20);
  const [score, setScore] = useState<number>(0);
  const [answersLog, setAnswersLog] = useState<Array<{
    question: QuizQuestion;
    selected: string;
    isCorrect: boolean;
  }>>([]);

  // Mode A: Watched Titles & Episodes Filtering for strict spoiler protection
  const watchedMovieIds = useMemo(() => {
    return Object.values(watchProgress)
      .filter(p => p.status === 'completed' || p.status === 'in_progress')
      .map(p => p.movieId);
  }, [watchProgress]);

  // Available Questions Pool based on config
  const availableQuestions = useMemo(() => {
    return QUIZ_QUESTIONS.filter(q => {
      // Spoiler Protection in Mode A
      if (quizMode === 'watched_only') {
        const isWatched = watchedMovieIds.includes(q.relatedMovieId);
        if (!isWatched) return false;

        // If it specifies a spoiler episode, check if user has watched it
        if (q.spoilerSeason && q.spoilerEpisode) {
          const epWatched = isEpisodeWatched(q.relatedMovieId, q.spoilerSeason, q.spoilerEpisode);
          if (!epWatched) return false;
        }
      }

      // Category Filter
      if (selectedCategory !== 'All Categories' && q.category !== selectedCategory) {
        return false;
      }

      // Difficulty Filter
      if (difficulty !== 'all' && q.difficulty !== difficulty) {
        return false;
      }

      return true;
    });
  }, [quizMode, selectedCategory, difficulty, watchedMovieIds, isEpisodeWatched]);

  // Start Quiz
  const handleStartQuiz = () => {
    if (availableQuestions.length === 0) return;

    // Shuffle and slice
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    const count = Math.min(questionCount, shuffled.length);
    setActiveQuestions(shuffled.slice(0, count));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setAnswersLog([]);
    setTimerSeconds(20);
    setGameState('playing');
  };

  // Timer Countdown in Playing State
  useEffect(() => {
    if (gameState !== 'playing' || !timerEnabled || isAnswerSubmitted) return;

    if (timerSeconds <= 0) {
      // Time expired: auto-submit as incorrect
      handleSubmitAnswer('__TIMEOUT__');
      return;
    }

    const timer = setInterval(() => {
      setTimerSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timerEnabled, timerSeconds, isAnswerSubmitted]);

  // Handle Option Click
  const handleSelectOption = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(option);
  };

  // Submit Answer
  const handleSubmitAnswer = (chosen = selectedAnswer) => {
    if (isAnswerSubmitted) return;

    const currentQ = activeQuestions[currentIndex];
    const isCorrect = chosen === currentQ.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswersLog(prev => [
      ...prev,
      {
        question: currentQ,
        selected: chosen || '__NO_ANSWER__',
        isCorrect
      }
    ]);

    setIsAnswerSubmitted(true);
  };

  // Next Question
  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setTimerSeconds(20);
    } else {
      // Quiz Finished!
      finishQuiz();
    }
  };

  // Finish Quiz and calculate analytics
  const finishQuiz = () => {
    const finalScore = score + (selectedAnswer === activeQuestions[currentIndex]?.correctAnswer ? 1 : 0);
    const total = activeQuestions.length;
    const percentage = total > 0 ? Math.round((finalScore / total) * 100) : 0;

    // Identify weak topics
    const categoryFails: Record<string, number> = {};
    answersLog.forEach(log => {
      if (!log.isCorrect) {
        categoryFails[log.question.category] = (categoryFails[log.question.category] || 0) + 1;
      }
    });

    const weakTopics = Object.entries(categoryFails)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);

    recordQuizAttempt({
      mode: quizMode,
      difficulty,
      category: selectedCategory,
      score: finalScore,
      totalQuestions: total,
      percentage,
      weakTopics
    });

    if (percentage >= 80) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }

    setGameState('results');
  };

  const currentQ = activeQuestions[currentIndex];

  return (
    <div className="space-y-8 pb-20">
      {/* ==================================================== */}
      {/* 1. LOBBY & CONFIGURATION SCREEN */}
      {/* ==================================================== */}
      {gameState === 'lobby' && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="doom-metallic-card rounded-3xl p-6 md:p-10 border border-border shadow-card">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 bg-doom-950 border border-doom-emerald/40 px-3 py-1 rounded-full text-xs font-mono text-doom-emerald">
                <Flame size={13} className="text-doom-emerald" />
                <span>INTERACTIVE LORE BATTLE ARENA</span>
              </div>

              <h2 className="font-cinematic text-4xl sm:text-6xl text-white uppercase tracking-wider ">
                KNOWLEDGE ARENA
              </h2>

              <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
                Test your knowledge of the Marvel Cinematic Multiverse with factually verified questions. Choose strict spoiler protection or challenge the full multiversal library.
              </p>
            </div>
          </div>

          {/* Configuration Card */}
          <div className="doom-metallic-card rounded-3xl p-6 md:p-8 border border-border space-y-6 shadow-card">
            <h3 className="font-cinematic text-2xl uppercase tracking-wider text-white flex items-center gap-2">
              <Filter size={18} className="text-doom-emerald" />
              <span>Configure Challenge Parameters</span>
            </h3>

            {/* Mode Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-marvel uppercase tracking-wider text-gray-400 font-bold">
                Quiz Mode & Spoiler Protection
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setQuizMode('watched_only')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    quizMode === 'watched_only'
                      ? 'bg-doom-950 border-doom-emerald shadow-sm'
                      : 'bg-doom-950/60 border-doom-border hover:border-doom-border-light'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck size={20} className="text-doom-emerald" />
                    <span className="font-marvel text-lg font-bold text-white tracking-wide">
                      Mode A: Watched Content Only
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Zero Spoilers guaranteed. Generates questions exclusively from movies and TV episodes you have marked as watched.
                  </p>
                </div>

                <div
                  onClick={() => setQuizMode('full_collection')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    quizMode === 'full_collection'
                      ? 'bg-doom-950 border-doom-red shadow-sm'
                      : 'bg-doom-950/60 border-doom-border hover:border-doom-border-light'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle size={20} className="text-doom-red" />
                    <span className="font-marvel text-lg font-bold text-white tracking-wide">
                      Mode B: Full Multiverse Pool
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Full Lore Access. Questions pulled from all titles across the Multiverse. Contains potential spoilers for unwatched titles.
                  </p>
                </div>
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-marvel uppercase tracking-wider text-gray-400 font-bold">
                Lore Category
              </label>
              <div className="flex flex-wrap gap-2">
                {QUIZ_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-doom-gold text-doom-950 font-bold shadow-md'
                        : 'bg-doom-950 text-gray-400 hover:text-white border border-doom-border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty, Question Count, and Timer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-marvel uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-doom-950 border border-doom-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-doom-red"
                >
                  <option value="all">Mixed Difficulties</option>
                  <option value="beginner">Beginner (Recruit)</option>
                  <option value="intermediate">Intermediate (Agent)</option>
                  <option value="expert">Expert (Nexus Being)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-marvel uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                  Question Count
                </label>
                <div className="flex gap-2">
                  {[5, 10, 15, 20].map(cnt => (
                    <button
                      key={cnt}
                      onClick={() => setQuestionCount(cnt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                        questionCount === cnt
                          ? 'bg-gradient-to-r from-doom-emerald-dark to-doom-emerald text-white border-doom-emerald/40 shadow-sm'
                          : 'bg-doom-950 text-gray-400 border-border hover:text-white'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-marvel uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                  Response Timer (20s)
                </label>
                <button
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                    timerEnabled
                      ? 'bg-doom-950 border-doom-emerald text-doom-emerald'
                      : 'bg-doom-950 border-border text-gray-500'
                  }`}
                >
                  <Clock size={14} />
                  <span>{timerEnabled ? '20s Timer Enabled' : 'Untimed Relaxed'}</span>
                </button>
              </div>
            </div>

            {/* Pool availability status & Launch */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-400 font-mono">
                Available Questions in Pool: <strong className="text-white">{availableQuestions.length}</strong>
                {quizMode === 'watched_only' && watchedMovieIds.length === 0 && (
                  <span className="text-doom-red ml-2 font-sans">
                    (You have not marked any titles watched yet! Switch to Mode B or check off watched titles)
                  </span>
                )}
              </div>

              <button
                onClick={handleStartQuiz}
                disabled={availableQuestions.length === 0}
                className="w-full sm:w-auto bg-gradient-to-r from-doom-emerald-dark to-doom-emerald hover:brightness-110 disabled:opacity-40 text-white px-8 py-3 rounded-xl font-cinematic text-xl tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 border border-doom-emerald/40 hover:scale-[1.02]"
              >
                <span>Enter Arena</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. ACTIVE QUIZ PLAYING SCREEN */}
      {/* ==================================================== */}
      {gameState === 'playing' && currentQ && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Status Header */}
          <div className="flex items-center justify-between bg-doom-950/90 border border-doom-border p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-doom-gold">
                QUESTION {currentIndex + 1} OF {activeQuestions.length}
              </span>
              <span className="text-[10px] bg-doom-900 text-gray-300 border border-doom-border px-2 py-0.5 rounded font-mono uppercase">
                {currentQ.category}
              </span>
              <span className="text-[10px] text-gray-500 font-mono uppercase">
                {currentQ.difficulty}
              </span>
            </div>

            {/* Timer */}
            {timerEnabled && (
              <div className={`flex items-center gap-1.5 font-mono text-xs px-3 py-1 rounded-full border ${
                timerSeconds <= 5 
                  ? 'bg-red-950 border-red-500 text-red-400 animate-pulse' 
                  : 'bg-doom-900 border-doom-border text-gray-300'
              }`}>
                <Clock size={13} />
                <span>{timerSeconds}s</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-doom-950 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-doom-emerald-dark to-doom-emerald transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="doom-metallic-card rounded-3xl p-6 md:p-8 border border-border space-y-6 shadow-card">
            <h3 className="font-marvel text-2xl md:text-3xl text-white font-bold tracking-wide leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQ.correctAnswer;
                
                let optionClasses = 'bg-doom-950/80 border-border hover:border-white/20 text-gray-200';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionClasses = 'bg-emerald-950/80 border-doom-emerald text-emerald-200 font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)]';
                  } else if (isSelected && !isCorrect) {
                    optionClasses = 'bg-red-950/80 border-red-500 text-red-200 line-through';
                  } else {
                    optionClasses = 'bg-doom-950/40 border-border/40 text-gray-600';
                  }
                } else if (isSelected) {
                  optionClasses = 'bg-doom-emerald/10 border-doom-emerald text-white font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between gap-3 ${optionClasses}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-doom-900 border border-white/10 flex items-center justify-center font-mono text-xs text-gray-400 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle size={18} className="text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Drawer when submitted */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-xl bg-doom-950 border border-border space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-marvel uppercase tracking-wider text-doom-emerald font-bold">
                  <BookOpen size={14} />
                  <span>Canonical Lore Explanation</span>
                </div>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Actions: Submit or Next */}
            <div className="pt-4 border-t border-border flex justify-end">
              {!isAnswerSubmitted ? (
                <button
                  onClick={() => handleSubmitAnswer()}
                  disabled={!selectedAnswer}
                  className="bg-gradient-to-r from-doom-emerald-dark to-doom-emerald hover:brightness-110 disabled:opacity-40 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md border border-doom-emerald/40"
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-doom-emerald-dark to-doom-emerald hover:brightness-110 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center gap-2 border border-doom-emerald/40"
                >
                  <span>{currentIndex + 1 < activeQuestions.length ? 'Next Question' : 'View Debrief & Results'}</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. DEBRIEF & RESULTS SCREEN */}
      {/* ==================================================== */}
      {gameState === 'results' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="doom-metallic-card rounded-3xl p-8 border border-border text-center space-y-4 shadow-card">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-doom-emerald-dark to-doom-emerald flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <Award size={40} />
            </div>

            <span className="text-xs font-marvel uppercase tracking-wider text-doom-emerald font-bold">
              Challenge Concluded
            </span>

            <h2 className="font-cinematic text-5xl md:text-6xl text-white uppercase tracking-wider">
              Score: {score} / {activeQuestions.length}
            </h2>

            <div className="font-mono text-2xl text-doom-emerald font-bold">
              {Math.round((score / activeQuestions.length) * 100)}% Accuracy
            </div>

            <p className="text-xs sm:text-sm text-gray-300 font-sans max-w-md mx-auto">
              {score / activeQuestions.length >= 0.8
                ? 'Outstanding performance. Your command of multiversal timelines and canon is combat-ready.'
                : 'Debrief complete. Review the question logs below and catch up on essential viewing.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setGameState('lobby')}
                className="bg-gradient-to-r from-doom-emerald-dark to-doom-emerald hover:brightness-110 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 border border-doom-emerald/40"
              >
                <RotateCcw size={14} />
                <span>Return to Arena Lobby</span>
              </button>
            </div>
          </div>

          {/* Question Review Breakdown */}
          <div className="space-y-3">
            <h4 className="font-marvel text-lg text-white font-bold tracking-wide">
              Question Debrief & Verification
            </h4>

            {answersLog.map((log, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-2 ${
                  log.isCorrect
                    ? 'bg-doom-950 border-emerald-900/60'
                    : 'bg-doom-950 border-red-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    {log.isCorrect ? (
                      <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                    )}
                    <div className="text-xs font-semibold text-white">
                      {log.question.question}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono shrink-0 uppercase">
                    {log.question.category}
                  </span>
                </div>

                <div className="text-xs font-sans pl-6 space-y-1">
                  <div className="text-gray-400">
                    Your answer: <span className={log.isCorrect ? 'text-emerald-300 font-semibold' : 'text-red-300'}>{log.selected}</span>
                  </div>
                  {!log.isCorrect && (
                    <div className="text-emerald-400">
                      Correct answer: <strong className="text-white">{log.question.correctAnswer}</strong>
                    </div>
                  )}
                  <p className="text-[11px] text-gray-400 italic pt-1">
                    "{log.question.explanation}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
