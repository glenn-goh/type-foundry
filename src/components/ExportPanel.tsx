import { useMemo, useState } from "react";
import { useAppConfig } from "@/context/AppConfigContext";
import { calculateTypeScale, generateCssVariables, generateJsonTokens, generateTailwindConfig } from "@/lib/scale-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import type { ScaleEntry } from "@/lib/types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopy}>
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

export default function ExportPanel({ scale }: { scale: ScaleEntry[] }) {
  const { config } = useAppConfig();

  const responsiveData = useMemo(() => {
    if (!config.responsive.enabled) return undefined;
    const base = config.responsive.baseFontSize ?? config.baseFontSize;
    const ratio = config.responsive.inheritRatio ? config.scaleRatio : (config.responsive.scaleRatio ?? config.scaleRatio);
    return {
      scale: calculateTypeScale(base, ratio),
      minWidth: config.responsive.minWidth,
    };
  }, [config]);

  const cssCode = useMemo(() => generateCssVariables(scale, config.unit, responsiveData), [scale, config.unit, responsiveData]);
  const jsonCode = useMemo(() => generateJsonTokens(scale, config.unit), [scale, config.unit]);
  const twCode = useMemo(() => generateTailwindConfig(scale, config.unit), [scale, config.unit]);

  return (
    <div className="border-t border-border">
      <Tabs defaultValue="css" className="w-full">
        <div className="flex items-center justify-between px-4 pt-2">
          <TabsList className="h-8">
            <TabsTrigger value="css" className="text-xs px-3 h-6">CSS</TabsTrigger>
            <TabsTrigger value="json" className="text-xs px-3 h-6">JSON</TabsTrigger>
            <TabsTrigger value="tailwind" className="text-xs px-3 h-6">Tailwind</TabsTrigger>
          </TabsList>
        </div>
        {[
          { value: "css", code: cssCode },
          { value: "json", code: jsonCode },
          { value: "tailwind", code: twCode },
        ].map(({ value, code }) => (
          <TabsContent key={value} value={value} className="mt-0 px-4 pb-3">
            <div className="relative rounded-md border border-border bg-muted/50">
              <div className="absolute right-1 top-1">
                <CopyButton text={code} />
              </div>
              <pre className="max-h-40 overflow-auto p-3 pr-10 text-xs leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
