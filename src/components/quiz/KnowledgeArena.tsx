import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS, QUIZ_CATEGORIES, QuizQuestion } from '../../data/quizBank';
import { useAppStore } from '../../services/store';

export const KnowledgeArena: React.FC = () => {
  const { watchProgress, isEpisodeWatched, recordQuizAttempt } = useAppStore();

  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'results'>('lobby');
  const [quizMode, setQuizMode] = useState<'watched_only' | 'full_collection'>('watched_only');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [difficulty, setDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'expert'>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);

  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(20);
  const [score, setScore] = useState<number>(0);
  const [answersLog, setAnswersLog] = useState<
    Array<{
      question: QuizQuestion;
      selected: string;
      isCorrect: boolean;
    }>
  >([]);

  const watchedMovieIds = useMemo(() => {
    return Object.values(watchProgress)
      .filter((p) => p.status === 'completed' || p.status === 'in_progress')
      .map((p) => p.movieId);
  }, [watchProgress]);

  const availableQuestions = useMemo(() => {
    return QUIZ_QUESTIONS.filter((q) => {
      if (quizMode === 'watched_only') {
        const isWatched = watchedMovieIds.includes(q.relatedMovieId);
        if (!isWatched) return false;
        if (q.spoilerSeason && q.spoilerEpisode) {
          const epWatched = isEpisodeWatched(q.relatedMovieId, q.spoilerSeason, q.spoilerEpisode);
          if (!epWatched) return false;
        }
      }
      if (selectedCategory !== 'All Categories' && q.category !== selectedCategory) return false;
      if (difficulty !== 'all' && q.difficulty !== difficulty) return false;
      return true;
    });
  }, [quizMode, selectedCategory, difficulty, watchedMovieIds, isEpisodeWatched]);

  const handleStartQuiz = () => {
    if (availableQuestions.length === 0) return;
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

  useEffect(() => {
    if (gameState !== 'playing' || !timerEnabled || isAnswerSubmitted) return;
    if (timerSeconds <= 0) {
      handleSubmitAnswer('__TIMEOUT__');
      return;
    }
    const timer = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timerEnabled, timerSeconds, isAnswerSubmitted]);

  const handleSelectOption = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = (chosen = selectedAnswer) => {
    if (isAnswerSubmitted) return;
    const currentQ = activeQuestions[currentIndex];
    const isCorrect = chosen === currentQ.correctAnswer;
    if (isCorrect) setScore((prev) => prev + 1);

    setAnswersLog((prev) => [
      ...prev,
      {
        question: currentQ,
        selected: chosen || 'No answer',
        isCorrect,
      },
    ]);
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setTimerSeconds(20);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const finalScore = score;
    const total = activeQuestions.length;
    const percentage = total > 0 ? Math.round((finalScore / total) * 100) : 0;

    const categoryFails: Record<string, number> = {};
    answersLog.forEach((log) => {
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
      weakTopics,
    });

    if (percentage >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 65,
          origin: { y: 0.6 },
        });
      } catch {}
    }

    setGameState('results');
  };

  const currentQ = activeQuestions[currentIndex];

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* 1. LOBBY SCREEN */}
      {gameState === 'lobby' && (
        <div className="space-y-6">
          <div className="pb-4 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Lore Quiz
            </h1>
            <span className="text-xs font-mono tabular-nums text-slate-400">
              {availableQuestions.length} matching questions
            </span>
          </div>

          <div className="bg-[#0f131b] rounded-2xl p-5 sm:p-6 border border-white/10 space-y-6">
            {/* Spoiler Mode */}
            <div className="space-y-2.5">
              <span className="block text-xs font-medium text-slate-300">
                Spoiler Filter
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setQuizMode('watched_only')}
                  aria-pressed={quizMode === 'watched_only'}
                  className={`ui-press ui-press--surface ui-press--on-dark ui-focus p-4 rounded-xl border text-left ${
                    quizMode === 'watched_only'
                      ? 'bg-emerald-500/10 border-emerald-500/45'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="inline-flex items-center gap-2 font-semibold text-sm text-white">
                      <ShieldCheck size={16} className="text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Watched Titles Only</span>
                    </span>
                    {quizMode === 'watched_only' && (
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" aria-hidden="true" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Restricts questions to titles and episodes marked as watched or watching.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setQuizMode('full_collection')}
                  aria-pressed={quizMode === 'full_collection'}
                  className={`ui-press ui-press--surface ui-press--on-dark ui-focus p-4 rounded-xl border text-left ${
                    quizMode === 'full_collection'
                      ? 'bg-emerald-500/10 border-emerald-500/45'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="inline-flex items-center gap-2 font-semibold text-sm text-white">
                      <AlertTriangle size={16} className="text-amber-400 shrink-0" aria-hidden="true" />
                      <span>All Titles (Full Multiverse)</span>
                    </span>
                    {quizMode === 'full_collection' && (
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" aria-hidden="true" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Includes all phases and titles regardless of your watch progress.
                  </p>
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2.5">
              <span className="block text-xs font-medium text-slate-300">
                Category
              </span>
              <div className="flex flex-wrap gap-2">
                {QUIZ_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={selectedCategory === cat}
                    className={`ui-press ui-press--on-dark ui-focus h-8 px-3 rounded-full text-xs font-medium border ${
                      selectedCategory === cat
                        ? 'bg-white text-doom-950 font-semibold border-white'
                        : 'bg-white/[0.03] text-slate-300 hover:text-white border-white/12'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Parameters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label htmlFor="quiz-difficulty" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Difficulty
                </label>
                <select
                  id="quiz-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="doom-select ui-field h-9 w-full border border-white/14 rounded-xl px-3 text-xs text-white"
                >
                  <option value="all">Mixed Difficulties</option>
                  <option value="beginner">Beginner (Recruit)</option>
                  <option value="intermediate">Intermediate (Agent)</option>
                  <option value="expert">Expert (Nexus Being)</option>
                </select>
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-300 mb-1.5">
                  Question Count
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[5, 10, 15, 20].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      aria-pressed={questionCount === cnt}
                      className={`ui-press ui-press--on-dark ui-focus h-9 rounded-xl text-xs font-mono font-semibold tabular-nums border ${
                        questionCount === cnt
                          ? 'bg-emerald-500 text-doom-950 border-emerald-400'
                          : 'bg-[#090a0f] text-slate-300 border-white/14 hover:text-white'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-300 mb-1.5">
                  Response Timer
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={timerEnabled}
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  className={`ui-press ui-press--on-dark ui-focus w-full h-9 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border ${
                    timerEnabled
                      ? 'bg-emerald-500/12 border-emerald-500/40 text-emerald-300'
                      : 'bg-[#090a0f] border-white/14 text-slate-400'
                  }`}
                >
                  <Clock size={14} aria-hidden="true" />
                  <span>{timerEnabled ? '20s per question' : 'Untimed'}</span>
                </button>
              </div>
            </div>

            {/* Launch Bar */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                <span>
                  Question pool:{' '}
                  <strong className="text-white font-mono tabular-nums">
                    {availableQuestions.length}
                  </strong>
                </span>
                {quizMode === 'watched_only' && watchedMovieIds.length === 0 && (
                  <p className="text-amber-300 mt-1">
                    No watched titles recorded yet. Switch to All Titles or mark titles watched.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleStartQuiz}
                disabled={availableQuestions.length === 0}
                className="ui-press ui-focus h-10 w-full sm:w-auto bg-white text-doom-950 px-6 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shrink-0"
              >
                <span>Enter Arena</span>
                <ChevronRight size={15} className="ui-icon-nudge" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE QUESTION SCREEN */}
      {gameState === 'playing' && currentQ && (
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="flex items-center justify-between bg-[#0f131b] border border-white/10 p-4 rounded-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-semibold text-emerald-400 tabular-nums">
                Question {currentIndex + 1} / {activeQuestions.length}
              </span>
              <span className="text-[11px] bg-white/[0.06] text-slate-200 border border-white/10 px-2 py-0.5 rounded-md">
                {currentQ.category}
              </span>
              <span className="text-[11px] text-slate-400 capitalize">
                {currentQ.difficulty}
              </span>
            </div>

            {timerEnabled && (
              <div
                aria-live="off"
                className={`inline-flex items-center gap-1.5 font-mono text-xs px-3 h-7 rounded-full border tabular-nums ${
                  timerSeconds <= 5
                    ? 'bg-rose-500/15 border-rose-500/50 text-rose-300'
                    : 'bg-white/[0.05] border-white/12 text-slate-200'
                }`}
              >
                <Clock size={12} aria-hidden="true" />
                <span>{timerSeconds}s</span>
              </div>
            )}
          </div>

          <div className="w-full bg-white/[0.08] h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-[width] duration-300 ease-out"
              style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          <div className="bg-[#0f131b] rounded-2xl p-5 sm:p-7 border border-white/10 space-y-5">
            <h2 className="text-lg sm:text-xl font-semibold text-white leading-snug">
              {currentQ.question}
            </h2>

            <div className="space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQ.correctAnswer;

                let optionClasses =
                  'bg-[#090a0f] border-white/12 hover:border-white/25 text-slate-200';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionClasses =
                      'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionClasses =
                      'bg-rose-500/15 border-rose-500/50 text-rose-200 line-through';
                  } else {
                    optionClasses = 'bg-[#090a0f]/50 border-white/[0.06] text-slate-500';
                  }
                } else if (isSelected) {
                  optionClasses =
                    'bg-emerald-500/12 border-emerald-400 text-white font-semibold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(option)}
                    aria-pressed={isSelected}
                    className={`ui-press ui-press--surface ui-press--on-dark ui-focus w-full p-3.5 rounded-xl border text-left text-sm flex items-center justify-between gap-3 ${optionClasses}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-md bg-white/[0.06] border border-white/10 flex items-center justify-center font-mono text-xs text-slate-300 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" aria-hidden="true" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle size={16} className="text-rose-400 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswerSubmitted && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <BookOpen size={13} aria-hidden="true" />
                  <span>Lore Note</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-white/[0.08] flex justify-end">
              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  onClick={() => handleSubmitAnswer()}
                  disabled={!selectedAnswer}
                  className="ui-press ui-focus h-9 bg-white text-doom-950 px-5 rounded-lg text-xs font-semibold"
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="ui-press ui-focus h-9 bg-white text-doom-950 px-5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <span>
                    {currentIndex + 1 < activeQuestions.length
                      ? 'Next Question'
                      : 'View Results'}
                  </span>
                  <ArrowRight size={14} className="ui-icon-nudge" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. RESULTS SCREEN */}
      {gameState === 'results' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-[#0f131b] rounded-2xl p-6 sm:p-8 border border-white/10 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
              <Award size={28} aria-hidden="true" />
            </div>

            <h2 className="font-cinematic text-4xl sm:text-5xl text-white uppercase tracking-wider tabular-nums">
              Score: {score} / {activeQuestions.length}
            </h2>

            <div className="font-mono text-xl text-emerald-400 font-bold tabular-nums">
              {Math.round((score / activeQuestions.length) * 100)}% Accuracy
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setGameState('lobby')}
                className="ui-press ui-focus h-10 bg-white text-doom-950 px-5 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span>Play Again</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white">Answer Review</h3>
            {answersLog.map((log, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-2 bg-[#0f131b] ${
                  log.isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    {log.isCorrect ? (
                      <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <XCircle size={15} className="text-rose-400 mt-0.5 shrink-0" aria-hidden="true" />
                    )}
                    <span className="text-xs sm:text-sm font-medium text-white">
                      {log.question.question}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {log.question.category}
                  </span>
                </div>

                <div className="text-xs pl-6 space-y-1">
                  <div className="text-slate-400">
                    Your answer:{' '}
                    <span className={log.isCorrect ? 'text-emerald-300 font-medium' : 'text-rose-300'}>
                      {log.selected}
                    </span>
                  </div>
                  {!log.isCorrect && (
                    <div className="text-emerald-300">
                      Correct: <strong className="text-white">{log.question.correctAnswer}</strong>
                    </div>
                  )}
                  <p className="text-slate-400 pt-1">{log.question.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
