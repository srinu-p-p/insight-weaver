export const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "Hindi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "Spanish", name: "Español", flag: "🇪🇸" },
  { code: "French", name: "Français", flag: "🇫🇷" },
  { code: "German", name: "Deutsch", flag: "🇩🇪" },
  { code: "Japanese", name: "日本語", flag: "🇯🇵" },
  { code: "Chinese", name: "中文", flag: "🇨🇳" },
  { code: "Korean", name: "한국어", flag: "🇰🇷" },
  { code: "Arabic", name: "العربية", flag: "🇸🇦" },
  { code: "Portuguese", name: "Português", flag: "🇧🇷" },
  { code: "Telugu", name: "తెలుగు", flag: "🇮🇳" },
  { code: "Tamil", name: "தமிழ்", flag: "🇮🇳" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];
