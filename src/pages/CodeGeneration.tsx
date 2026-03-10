import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Code, Copy, Download, Loader2, Sparkles, Terminal, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useHistory } from "@/hooks/use-history";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import LanguageSelector from "@/components/LanguageSelector";
import DepthSelector from "@/components/DepthSelector";
import { streamAIContent } from "@/lib/ai-stream";
import type { LanguageCode } from "@/lib/languages";

export default function CodeGeneration() {
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
    const id = addItem({ topic, mode: "code", depth, language, content });
    setSavedId(id);
    toast.success("Saved to history!");
  };

  const toggleFav = () => {
    if (savedId) { toggleFavorite(savedId); toast.success("Toggled favorite!"); }
    else {
      const id = addItem({ topic, mode: "code", depth, language, content });
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
      topic, mode: "code", depth: depth as "brief" | "detailed" | "comprehensive", language,
      onDelta: (text) => setContent((prev) => prev + text),
      onDone: () => { setLoading(false); toast.success("Code generated!"); },
      onError: (err) => { setLoading(false); toast.error(err); },
      signal: controller.signal,
    });
  };

  // Extract code blocks from content
  const codeMatch = content.match(/```python\n([\s\S]*?)```/);
  const codeOnly = codeMatch ? codeMatch[1].trim() : "";
  const explanation = codeMatch ? content.replace(codeMatch[0], "").trim() : content;

  // Detect dependencies
  const deps: string[] = [];
  const depMap: Record<string, string> = {
    sklearn: "scikit-learn", pandas: "pandas", numpy: "numpy", matplotlib: "matplotlib",
    tensorflow: "tensorflow", torch: "torch", keras: "keras", scipy: "scipy",
    seaborn: "seaborn", xgboost: "xgboost",
  };
  if (codeOnly) {
    for (const [imp, pkg] of Object.entries(depMap)) {
      if (codeOnly.includes(`import ${imp}`) || codeOnly.includes(`from ${imp}`)) deps.push(pkg);
    }
  }

  const copyCode = () => { navigator.clipboard.writeText(codeOnly || content); toast.success("Code copied!"); };
  const downloadCode = () => {
    const blob = new Blob([codeOnly || content], { type: "text/x-python" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${topic.replace(/\s+/g, "_")}.py`; a.click();
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Code Generation</h1>
          </div>
          <p className="text-muted-foreground">Generate working Python code with detailed explanations for any ML concept</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-card border border-border rounded-xl p-6 mb-8">
          <label className="text-sm font-medium mb-2 block">What code would you like to generate?</label>
          <Input
            value={topic} onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., k-means clustering implementation"
            className="bg-secondary border-border mb-4"
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <DepthSelector value={depth} onChange={setDepth} />
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>
          <Button onClick={generate} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Generating..." : "Generate Code"}
          </Button>
        </motion.div>

        {content && (
          <div className="space-y-6">
            {/* Explanation */}
            {explanation && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-3">Explanation</h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
              </motion.div>
            )}

            {/* Code */}
            {codeOnly && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-gradient-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Python Code</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyCode} className="border-border">
                      <Copy className="h-4 w-4 mr-1" /> Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadCode} className="border-border">
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                  </div>
                </div>
                <SyntaxHighlighter language="python" style={vscDarkPlus}
                  customStyle={{ borderRadius: "0.75rem", fontSize: "0.85rem", background: "hsl(222 47% 7%)" }}>
                  {codeOnly}
                </SyntaxHighlighter>
              </motion.div>
            )}

            {/* Dependencies */}
            {deps.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-gradient-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-3">📦 Required Dependencies</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {deps.map((d) => (
                    <span key={d} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{d}</span>
                  ))}
                </div>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm text-muted-foreground">
                  pip install {deps.join(" ")}
                </div>
              </motion.div>
            )}

            {/* How to Run */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-gradient-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-3">🚀 How to Run This Code</h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Click <strong className="text-foreground">"Copy Code"</strong> above</li>
                <li>Open <a href="https://colab.research.google.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google Colab</a></li>
                <li>Create a new notebook</li>
                <li>Paste the code into a cell</li>
                <li>Run with <strong className="text-foreground">Shift + Enter</strong></li>
              </ol>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
