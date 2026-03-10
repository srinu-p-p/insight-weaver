import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Star, Trash2, BookOpen, Code, Headphones, Image as ImageIcon, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHistory, type HistoryItem } from "@/hooks/use-history";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const modeConfig: Record<string, { icon: typeof BookOpen; label: string; color: string }> = {
  text: { icon: BookOpen, label: "Text", color: "text-primary" },
  code: { icon: Code, label: "Code", color: "text-primary" },
  audio: { icon: Headphones, label: "Audio", color: "text-accent" },
  image: { icon: ImageIcon, label: "Image", color: "text-primary" },
};

export default function HistoryPage() {
  const { items, toggleFavorite, removeItem, clearAll } = useHistory();
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = items
    .filter((item) => filter === "all" || item.favorite)
    .filter((item) => item.topic.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <History className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">History & Favorites</h1>
          </div>
          <p className="text-muted-foreground">Access your previously generated explanations and saved favorites</p>
        </motion.div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-card border border-border rounded-xl p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="bg-secondary border-border pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-primary text-primary-foreground" : "border-border"}
            >
              All ({items.length})
            </Button>
            <Button
              variant={filter === "favorites" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("favorites")}
              className={filter === "favorites" ? "bg-primary text-primary-foreground" : "border-border"}
            >
              <Star className="h-3.5 w-3.5 mr-1" />
              Favorites ({items.filter((i) => i.favorite).length})
            </Button>
          </div>
          {items.length > 0 && (
            <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => { clearAll(); toast.success("History cleared"); }}>
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear All
            </Button>
          )}
        </motion.div>

        {/* List */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-gradient-card border border-border rounded-xl p-12 text-center">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {items.length === 0 ? "No history yet" : "No results found"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {items.length === 0
                ? "Generate some content and save it to see it here!"
                : "Try a different search term or filter."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((item) => {
                const config = modeConfig[item.mode];
                const Icon = config.icon;
                const isExpanded = expanded === item.id;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-gradient-card border border-border rounded-xl overflow-hidden"
                  >
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.topic}</h4>
                        <p className="text-xs text-muted-foreground">
                          {config.label} · {item.depth} · {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}>
                          <Star className={`h-4 w-4 ${item.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => { e.stopPropagation(); removeItem(item.id); toast.success("Removed"); }}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-border"
                        >
                          <div className="p-4 max-h-96 overflow-y-auto">
                            <div className="prose prose-invert prose-sm max-w-none">
                              <ReactMarkdown>{item.content}</ReactMarkdown>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
