import { FONT_FAMILIES, GOOGLE_FONTS } from "@/lib/types";
import { loadGoogleFont } from "@/lib/scale-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface FontSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function FontSelector({ value, onValueChange }: FontSelectorProps) {
  const handleChange = (v: string) => {
    loadGoogleFont(v);
    onValueChange(v);
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
      <SelectContent className="max-h-60">
        <div className="px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Default</div>
        {FONT_FAMILIES.map((f) => (
          <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
        ))}
        <Separator className="my-1" />
        <div className="px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Google Fonts</div>
        {GOOGLE_FONTS.map((f) => (
          <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
