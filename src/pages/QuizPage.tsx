import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Loader2, Sparkles, RotateCcw, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import LanguageSelector from "@/components/LanguageSelector";
import DepthSelector from "@/components/DepthSelector";
import type { LanguageCode } from "@/lib/languages";
import { Progress } from "@/components/ui/progress";

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-learn`;

interface MCQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Flashcard {
  front: string;
  back: string;
}

type QuizMode = "mcq" | "flashcard";

export default function QuizPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("detailed");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [quizMode, setQuizMode] = useState<QuizMode>("mcq");
  const [loading, setLoading] = useState(false);

  // MCQ state
  const [questions, setQuestions] = useState<MCQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Flashcard state
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const reset = () => {
    setQuestions([]);
    setCards([]);
    setCurrentQ(0);
    setCurrentCard(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setFlipped(false);
  };

  const generate = async () => {
    if (!topic.trim()) { toast.error("Please enter a topic"); return; }
    reset();
    setLoading(true);

    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          topic,
          mode: "quiz",
          depth,
          language,
          quizMode: quizMode === "mcq" ? "mcq" : "flashcard",
        }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({ error: "Request failed" }));
        toast.error(data.error || `Error: ${resp.status}`);
        setLoading(false);
        return;
      }

      const raw = await resp.text();
      // Extract JSON array from response (handle markdown code blocks)
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        toast.error("Failed to parse quiz data");
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(jsonMatch[0]);

      if (quizMode === "mcq") {
        setQuestions(parsed);
      } else {
        setCards(parsed);
      }

      toast.success(`${quizMode === "mcq" ? "Quiz" : "Flashcards"} generated!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[currentQ].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const hasContent = questions.length > 0 || cards.length > 0;

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-accent" />
            </div>
            <h1 className="text-3xl font-bold">Quiz & Flashcards</h1>
          </div>
          <p className="text-muted-foreground">Test your knowledge on any Machine Learning topic</p>
        </motion.div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-card border border-border rounded-xl p-6 mb-8">
          <label className="text-sm font-medium mb-2 block">Machine Learning Topic</label>
          <Input
            value={topic} onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., convolutional neural networks"
            className="bg-secondary border-border mb-4"
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Mode</label>
              <div className="flex gap-2">
                <Button
                  variant={quizMode === "mcq" ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setQuizMode("mcq"); reset(); }}
                  className={quizMode === "mcq" ? "bg-accent text-accent-foreground hover:bg-accent/90" : "border-border"}
                >
                  Multiple Choice
                </Button>
                <Button
                  variant={quizMode === "flashcard" ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setQuizMode("flashcard"); reset(); }}
                  className={quizMode === "flashcard" ? "bg-accent text-accent-foreground hover:bg-accent/90" : "border-border"}
                >
                  Flashcards
                </Button>
              </div>
            </div>
            <DepthSelector value={depth} onChange={setDepth} />
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>

          <Button onClick={generate} disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90 glow-accent">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Generating..." : `Generate ${quizMode === "mcq" ? "Quiz" : "Flashcards"}`}
          </Button>
        </motion.div>

        {/* MCQ Quiz */}
        {quizMode === "mcq" && questions.length > 0 && !finished && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
              <span className="text-sm font-medium text-accent">Score: {score}/{questions.length}</span>
            </div>
            <Progress value={((currentQ + 1) / questions.length) * 100} className="mb-6 h-2" />

            <AnimatePresence mode="wait">
              <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h3 className="text-lg font-semibold mb-5">{questions[currentQ].question}</h3>
                <div className="space-y-3">
                  {questions[currentQ].options.map((opt, idx) => {
                    const isCorrect = idx === questions[currentQ].correctIndex;
                    const isSelected = idx === selected;
                    let optionClass = "border border-border bg-secondary/50 hover:bg-secondary";
                    if (answered) {
                      if (isCorrect) optionClass = "border-green-500 bg-green-500/10";
                      else if (isSelected && !isCorrect) optionClass = "border-destructive bg-destructive/10";
                      else optionClass = "border-border bg-secondary/30 opacity-60";
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={answered}
                        className={`w-full text-left p-4 rounded-lg transition-all flex items-center gap-3 ${optionClass}`}
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-full border border-border flex items-center justify-center text-xs font-semibold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {answered && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                        {answered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                    <div className="bg-secondary/50 border border-border rounded-lg p-4 mb-4">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Explanation:</strong> {questions[currentQ].explanation}
                      </p>
                    </div>
                    <Button onClick={nextQuestion} className="bg-accent text-accent-foreground hover:bg-accent/90">
                      {currentQ + 1 >= questions.length ? "See Results" : "Next Question"}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* MCQ Results */}
        {quizMode === "mcq" && finished && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-card border border-border rounded-xl p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Brain className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-4xl font-bold text-accent mb-2">{score}/{questions.length}</p>
            <p className="text-muted-foreground mb-6">
              {score === questions.length ? "Perfect score! 🎉" :
               score >= questions.length * 0.7 ? "Great job! 💪" :
               score >= questions.length * 0.5 ? "Good effort! Keep learning 📚" :
               "Keep practicing! You'll get there 🚀"}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={reset} variant="outline" className="border-border">
                <RotateCcw className="mr-2 h-4 w-4" /> Try Again
              </Button>
              <Button onClick={generate} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Sparkles className="mr-2 h-4 w-4" /> New Quiz
              </Button>
            </div>
          </motion.div>
        )}

        {/* Flashcards */}
        {quizMode === "flashcard" && cards.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Card {currentCard + 1} of {cards.length}</span>
              <span className="text-xs text-muted-foreground">Click card to flip</span>
            </div>
            <Progress value={((currentCard + 1) / cards.length) * 100} className="mb-6 h-2" />

            <div
              className="relative cursor-pointer mx-auto max-w-xl"
              style={{ perspective: "1000px" }}
              onClick={() => setFlipped(!flipped)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentCard}-${flipped}`}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`min-h-[220px] rounded-xl border p-8 flex items-center justify-center text-center ${
                    flipped
                      ? "bg-accent/5 border-accent/30"
                      : "bg-secondary/50 border-border"
                  }`}
                >
                  <div>
                    <span className="text-xs font-medium text-muted-foreground mb-3 block uppercase tracking-wider">
                      {flipped ? "Answer" : "Question"}
                    </span>
                    <p className={`text-lg font-medium ${flipped ? "text-accent-foreground" : ""}`}>
                      {flipped ? cards[currentCard].back : cards[currentCard].front}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                className="border-border"
                disabled={currentCard === 0}
                onClick={() => { setCurrentCard((c) => c - 1); setFlipped(false); }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">{currentCard + 1} / {cards.length}</span>
              <Button
                variant="outline"
                size="icon"
                className="border-border"
                disabled={currentCard === cards.length - 1}
                onClick={() => { setCurrentCard((c) => c + 1); setFlipped(false); }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!hasContent && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-8 bg-gradient-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-3">🧠 How It Works</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong className="text-foreground">Multiple Choice:</strong> 5 AI-generated questions with instant feedback and explanations</li>
              <li>• <strong className="text-foreground">Flashcards:</strong> 8 flip cards to review key concepts at your own pace</li>
              <li>• <strong className="text-foreground">Depth Levels:</strong> Brief for quick review, Comprehensive for deep testing</li>
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}
