import { motion } from "framer-motion";
import { Info, Brain, BookOpen, Code, Headphones, Image, Globe } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Text Explanations", desc: "Structured, markdown-formatted educational content with learning objectives and real-world examples." },
  { icon: Code, title: "Code Generation", desc: "Production-ready Python implementations with comments, dependency detection, and Google Colab instructions." },
  { icon: Headphones, title: "Audio Learning", desc: "Conversational audio scripts with browser-based text-to-speech for on-the-go learning." },
  { icon: Image, title: "Visual Diagrams", desc: "Technical diagram specifications and descriptions for understanding complex architectures." },
  { icon: Globe, title: "Multi-Language", desc: "Support for 12+ languages including Hindi, Spanish, French, German, Japanese, Chinese, and more." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">About GyanGuru</h1>
          </div>
          <p className="text-muted-foreground">AI-Powered Learning Assistant for AI & ML</p>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Project Description</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              GyanGuru is a revolutionary AI-powered web application designed to transform how students, educators,
              and professionals learn Machine Learning concepts through multiple interactive modalities. It leverages
              advanced AI models to provide comprehensive, personalized learning experiences including text explanations,
              code generation, audio lessons, and visual diagrams.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              The platform delivers instant, AI-powered content generation that adapts to different learning styles
              and preferences. Using a modern technology stack with React, TypeScript, and cloud-based AI services,
              it provides a seamless and responsive multi-modal learning experience.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-gradient-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex gap-3 p-3 bg-secondary rounded-lg">
                    <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm">{f.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-gradient-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">Technology Stack</h2>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Tailwind CSS", "Lovable Cloud", "AI Gateway", "Framer Motion", "Shadcn UI"].map((t) => (
                <span key={t} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">{t}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-gradient-card border border-border rounded-xl p-6 text-center">
            <p className="text-muted-foreground text-sm">
              This tool is designed for educational purposes. Always verify information from multiple sources.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
