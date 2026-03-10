import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Headphones, Loader2, Sparkles, Play, Pause, Download, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useHistory } from "@/hooks/use-history";
import ReactMarkdown from "react-markdown";
import LanguageSelector from "@/components/LanguageSelector";
import DepthSelector from "@/components/DepthSelector";
import { streamAIContent } from "@/lib/ai-stream";
import type { LanguageCode } from "@/lib/languages";

export default function AudioLearning() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("detailed");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const generate = async () => {
    if (!topic.trim()) { toast.error("Please enter a topic"); return; }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setScript("");
    setLoading(true);
    window.speechSynthesis.cancel();
    setSpeaking(false);

    await streamAIContent({
      topic, mode: "audio", depth: depth as "brief" | "detailed" | "comprehensive", language,
      onDelta: (text) => setScript((prev) => prev + text),
      onDone: () => { setLoading(false); toast.success("Audio script generated!"); },
      onError: (err) => { setLoading(false); toast.error(err); },
      signal: controller.signal,
    });
  };

  const toggleSpeech = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const cleanText = script.replace(/\(Pause\)/gi, ". ").replace(/[#*_`]/g, "").replace(/\n+/g, ". ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Try to match language
    const langMap: Record<string, string> = {
      en: "en-US", Hindi: "hi-IN", Spanish: "es-ES", French: "fr-FR",
      German: "de-DE", Japanese: "ja-JP", Chinese: "zh-CN", Korean: "ko-KR",
      Arabic: "ar-SA", Portuguese: "pt-BR", Telugu: "te-IN", Tamil: "ta-IN",
    };
    utterance.lang = langMap[language] || "en-US";

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const downloadScript = () => {
    const blob = new Blob([script], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${topic.replace(/\s+/g, "_")}_audio_script.txt`; a.click();
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center glow-accent">
              <Headphones className="h-5 w-5 text-accent" />
            </div>
            <h1 className="text-3xl font-bold">Audio Learning</h1>
          </div>
          <p className="text-muted-foreground">Listen to AI-generated audio explanations of ML concepts — perfect for learning on the go!</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-card border border-border rounded-xl p-6 mb-8">
          <label className="text-sm font-medium mb-2 block">What would you like to listen to?</label>
          <Input
            value={topic} onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., decision trees in machine learning"
            className="bg-secondary border-border mb-4"
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <DepthSelector value={depth} onChange={setDepth} />
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>
          <Button onClick={generate} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Generating..." : "Generate Audio"}
          </Button>
        </motion.div>

        {script && (
          <div className="space-y-6">
            {/* Audio Player */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">🎧 Audio Lesson</h2>
              <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                <Button onClick={toggleSpeech}
                  className={speaking ? "bg-destructive hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}
                  size="icon">
                  {speaking ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <div className="flex-1">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    {speaking && <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "60%" }} />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {speaking ? "Playing... Click pause to stop" : "Click play to listen"}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadScript} className="border-border">
                  <Download className="h-4 w-4 mr-1" /> Script
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Uses browser's built-in speech synthesis. Quality varies by browser and language.
              </p>
            </motion.div>

            {/* Script */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-gradient-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-3">📝 Audio Script</h2>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{script}</ReactMarkdown>
              </div>
            </motion.div>
          </div>
        )}

        {/* Tips */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-3">🎵 Audio Learning Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong className="text-foreground">Learn While Moving:</strong> Listen during commutes or workouts</li>
            <li>• <strong className="text-foreground">Repeat & Retain:</strong> Replay sections for better understanding</li>
            <li>• <strong className="text-foreground">Take Notes:</strong> Jot down key points while listening</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
