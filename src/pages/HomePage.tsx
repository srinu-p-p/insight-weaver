import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Code, Headphones, Image, Sparkles, Shield, Github, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBrain from "@/assets/hero-brain.png";

const modes = [
  {
    title: "Text Explanations",
    desc: "Get comprehensive text-based explanations of any ML topic with clear examples and structured learning paths.",
    icon: BookOpen,
    features: ["Clear explanations", "Real-world examples", "Structured content"],
    link: "/text",
    cta: "Start Learning",
  },
  {
    title: "Code Examples",
    desc: "Generate working Python code with detailed explanations. Run examples in Google Colab or your local environment.",
    icon: Code,
    features: ["Working Python code", "Detailed comments", "Ready to execute"],
    link: "/code",
    cta: "Generate Code",
  },
  {
    title: "Audio Lessons",
    desc: "Listen to audio explanations perfect for learning on the go. Download or listen in browser.",
    icon: Headphones,
    features: ["Natural speech", "Learn on the go", "Browser playback"],
    link: "/audio",
    cta: "Listen Now",
  },
  {
    title: "Visual Diagrams",
    desc: "Generate AI-powered visual explanations and diagrams to understand complex ML concepts intuitively.",
    icon: Image,
    features: ["AI-generated diagrams", "Technical illustrations", "Visual learning"],
    link: "/images",
    cta: "Visualize Now",
  },
];

const features = [
  { icon: Zap, title: "Learn at Your Pace", desc: "Choose between brief, detailed, or comprehensive explanations." },
  { icon: Shield, title: "Secure & Private", desc: "All processing happens securely through our cloud backend." },
  { icon: Github, title: "Multi-Language", desc: "Get explanations in 12+ languages for global accessibility." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <img src={heroBrain} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              {["Powered by AI", "Multi-Modal Learning", "12+ Languages"].map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gradient-primary">GyanGuru</span>
              <br />
              <span className="text-foreground">AI-Powered ML Learning</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Master Machine Learning with AI-powered explanations, code examples, audio lessons, and visual diagrams!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-base px-8">
                <Link to="/text"><Sparkles className="mr-2 h-5 w-5" />Start Learning</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary text-base px-8">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Learning Modes */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Learning Mode</h2>
            <p className="text-muted-foreground text-lg">Multiple modalities to match your learning style</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modes.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={mode.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={mode.link} className="block h-full">
                    <div className="bg-gradient-card border border-border rounded-xl p-6 h-full hover:border-primary/30 hover:glow-primary transition-all duration-300 group">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{mode.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{mode.desc}</p>
                      <ul className="space-y-1 mb-4">
                        {mode.features.map((f) => (
                          <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-primary" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        {mode.cta} <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-8 text-lg">Begin your ML learning journey today!</p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-base px-8">
            <Link to="/text"><Sparkles className="mr-2 h-5 w-5" />Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
