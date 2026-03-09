import { motion } from "framer-motion";
import { Settings, Info } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">Configure your learning experience</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-sm mb-1">No API Keys Required</h3>
              <p className="text-sm text-muted-foreground">
                This application uses Lovable Cloud's built-in AI gateway. No external API keys are needed!
                All AI processing is handled securely through our cloud backend.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="font-medium mb-2">✅ Active Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Text Explanations — AI-powered ML explanations</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Code Generation — Working Python code examples</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Audio Learning — Browser-based text-to-speech</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Image Visualization — AI diagram descriptions</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Multi-Language — 12+ language support</li>
              </ul>
            </div>

            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="font-medium mb-2">🌐 Supported Languages</h3>
              <p className="text-sm text-muted-foreground">
                English, Hindi, Spanish, French, German, Japanese, Chinese, Korean, Arabic, Portuguese, Telugu, Tamil
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
