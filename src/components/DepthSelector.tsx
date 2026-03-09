import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers } from "lucide-react";

interface DepthSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

const depths = [
  { value: "brief", label: "Brief", desc: "2-3 paragraphs" },
  { value: "detailed", label: "Detailed", desc: "5-7 paragraphs" },
  { value: "comprehensive", label: "Comprehensive", desc: "In-depth coverage" },
];

export default function DepthSelector({ value, onChange }: DepthSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Layers className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[220px] bg-secondary border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {depths.map((d) => (
            <SelectItem key={d.value} value={d.value}>
              <span className="flex items-center gap-2">
                <span className="font-medium">{d.label}</span>
                <span className="text-muted-foreground text-xs">— {d.desc}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
