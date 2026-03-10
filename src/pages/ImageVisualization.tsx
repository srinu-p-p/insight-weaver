import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Loader2, Sparkles, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useHistory } from "@/hooks/use-history";
import ReactMarkdown from "react-markdown";
import LanguageSelector from "@/components/LanguageSelector";
import DepthSelector from "@/components/DepthSelector";
import { streamAIContent } from "@/lib/ai-stream";
import type { LanguageCode } from "@/lib/languages";

export default function ImageVisualization() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("detailed");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const generate = async () => {
    if (!topic.trim()) { toast.error("Please enter a topic"); return; }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setContent("");
    setLoading(true);

    await streamAIContent({
      topic, mode: "image", depth: depth as "brief" | "detailed" | "comprehensive", language,
      onDelta: (text) => setContent((prev) => prev + text),
      onDone: () => { setLoading(false); toast.success("Visualization descriptions generated!"); },
      onError: (err) => { setLoading(false); toast.error(err); },
      signal: controller.signal,
    });
  };

  // Parse image prompts
  const prompts = content.split("IMG-PROMPT::").filter((_, i) => i > 0).map((p) => p.trim());
  const explanation = content.split("IMG-PROMPT::")[0]?.trim() || content;

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Image Visualization</h1>
          </div>
          <p className="text-muted-foreground">Generate AI-powered visual diagram descriptions to understand ML concepts intuitively</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-card border border-border rounded-xl p-6 mb-8">
          <label className="text-sm font-medium mb-2 block">What would you like to visualize?</label>
          <Input
            value={topic} onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., convolutional neural network architecture"
            className="bg-secondary border-border mb-4"
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <DepthSelector value={depth} onChange={setDepth} />
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>
          <Button onClick={generate} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Generating..." : "Generate Visualizations"}
          </Button>
        </motion.div>

        {content && (
          <div className="space-y-6">
            {/* Explanation */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-3">Topic Overview</h2>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{explanation}</ReactMarkdown>
              </div>
            </motion.div>

            {/* Image Prompts */}
            {prompts.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-gradient-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">🖼️ Generated Visualization Descriptions</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prompts.map((prompt, i) => (
                    <div key={i} className="bg-secondary rounded-lg p-4 border border-border">
                      <div className="w-full aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                        <div className="text-center p-4">
                          <ImageIcon className="h-8 w-8 text-primary mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">Diagram {i + 1}</p>
                        </div>
                      </div>
                      <h4 className="text-sm font-medium mb-1">Prompt {i + 1}</h4>
                      <p className="text-xs text-muted-foreground">{prompt}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Tips */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-3">🎨 Visual Learning Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong className="text-foreground">Study Diagrams:</strong> Visual representations help understand complex architectures</li>
            <li>• <strong className="text-foreground">Draw Your Own:</strong> Recreate the described diagrams to deepen understanding</li>
            <li>• <strong className="text-foreground">Compare:</strong> Use prompts to create different perspectives of the same concept</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
