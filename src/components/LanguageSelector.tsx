import { LANGUAGES, type LanguageCode } from "@/lib/languages";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  value: LanguageCode;
  onChange: (val: LanguageCode) => void;
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={(v) => onChange(v as LanguageCode)}>
        <SelectTrigger className="w-[180px] bg-secondary border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
