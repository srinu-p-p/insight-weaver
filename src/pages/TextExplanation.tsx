import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { BookOpen, Copy, Download, Loader2, Sparkles, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useHistory } from "@/hooks/use-history";
import ReactMarkdown from "react-markdown";
import LanguageSelector from "@/components/LanguageSelector";
import DepthSelector from "@/components/DepthSelector";
import { streamAIContent } from "@/lib/ai-stream";
import type { LanguageCode } from "@/lib/languages";

export default function TextExplanation() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("detailed");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { addItem, toggleFavorite } = useHistory();

  const saveToHistory = () => {
    if (!content) return;
    const id = addItem({ topic, mode: "text", depth, language, content });
    setSavedId(id);
    toast.success("Saved to history!");
  };

  const toggleFav = () => {
    if (savedId) { toggleFavorite(savedId); toast.success("Toggled favorite!"); }
    else {
      const id = addItem({ topic, mode: "text", depth, language, content });
      setSavedId(id);
      toggleFavorite(id);
      toast.success("Saved & favorited!");
    }
  };

  const generate = async () => {
    if (!topic.trim()) { toast.error("Please enter a topic"); return; }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setContent("");
    setLoading(true);

    await streamAIContent({
      topic, mode: "text", depth: depth as "brief" | "detailed" | "comprehensive", language,
      onDelta: (text) => setContent((prev) => prev + text),
      onDone: () => { setLoading(false); toast.success("Explanation generated!"); },
      onError: (err) => { setLoading(false); toast.error(err); },
      signal: controller.signal,
    });
  };

  const copy = () => { navigator.clipboard.writeText(content); toast.success("Copied!"); };
  const download = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${topic.replace(/\s+/g, "_")}_explanation.md`; a.click();
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Text Explanation</h1>
          </div>
          <p className="text-muted-foreground">Get comprehensive text-based explanations of any Machine Learning topic</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-card border border-border rounded-xl p-6 mb-8">
          <label className="text-sm font-medium mb-2 block">Machine Learning Topic</label>
          <Input
            value={topic} onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., backpropagation in neural networks"
            className="bg-secondary border-border mb-4"
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <DepthSelector value={depth} onChange={setDepth} />
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>
          <Button onClick={generate} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Generating..." : "Generate Explanation"}
          </Button>
        </motion.div>

        {content && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Explanation</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={saveToHistory} className="border-border">
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
                <Button variant="outline" size="sm" onClick={toggleFav} className="border-border">
                  <Star className={`h-4 w-4 mr-1 ${savedId ? "fill-yellow-400 text-yellow-400" : ""}`} /> Favorite
                </Button>
                <Button variant="outline" size="sm" onClick={copy} className="border-border">
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={download} className="border-border">
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-3">💡 Tips for Better Learning</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong className="text-foreground">Be Specific:</strong> Use clear terms like "convolutional neural networks" instead of "CNN"</li>
            <li>• <strong className="text-foreground">Build Foundation:</strong> Start with basic concepts before advanced topics</li>
            <li>• <strong className="text-foreground">Iterate:</strong> Don't hesitate to ask follow-up questions</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
