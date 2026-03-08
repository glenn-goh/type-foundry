import { useMemo, useState } from "react";
import { useAppConfig } from "@/context/AppConfigContext";
import { calculateTypeScale, generateCssVariables, generateJsonTokens, generateTailwindConfig, generateFigmaTokens } from "@/lib/scale-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from "lucide-react";
import type { ScaleEntry } from "@/lib/types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopy} title="Copy to clipboard">
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

function DownloadButton({ text, filename }: { text: string; filename: string }) {
  const handleDownload = () => {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleDownload} title={`Download ${filename}`}>
      <Download className="h-3.5 w-3.5" />
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
      scale: calculateTypeScale(base, ratio, config.rounding),
      minWidth: config.responsive.minWidth,
    };
  }, [config]);

  const cssCode = useMemo(() => generateCssVariables(scale, config.unit, responsiveData), [scale, config.unit, responsiveData]);
  const jsonCode = useMemo(() => generateJsonTokens(scale, config.unit), [scale, config.unit]);
  const twCode = useMemo(() => generateTailwindConfig(scale, config.unit), [scale, config.unit]);
  const figmaCode = useMemo(
    () => generateFigmaTokens(scale, config.unit, config.body, config.headings),
    [scale, config.unit, config.body, config.headings]
  );

  return (
    <div className="border-t border-border">
      <Tabs defaultValue="css" className="w-full">
        <div className="flex items-center justify-between px-4 pt-2">
          <TabsList className="h-8">
            <TabsTrigger value="css" className="text-xs px-3 h-6">CSS</TabsTrigger>
            <TabsTrigger value="json" className="text-xs px-3 h-6">JSON</TabsTrigger>
            <TabsTrigger value="tailwind" className="text-xs px-3 h-6">Tailwind</TabsTrigger>
            <TabsTrigger value="figma" className="text-xs px-3 h-6">Figma</TabsTrigger>
          </TabsList>
        </div>
        {[
          { value: "css", code: cssCode },
          { value: "json", code: jsonCode },
          { value: "tailwind", code: twCode },
          { value: "figma", code: figmaCode },
        ].map(({ value, code }) => (
          <TabsContent key={value} value={value} className="mt-0 px-4 pb-3">
            {value === "figma" && (
              <p className="mb-2 text-xs text-muted-foreground">
                Import via{" "}
                <a
                  href="https://www.figma.com/community/plugin/843461159747178978"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Tokens Studio for Figma
                </a>
                {" "}plugin → Load → paste JSON or import the downloaded file.
              </p>
            )}
            <div className="relative rounded-md border border-border bg-muted/50">
              <div className="absolute right-1 top-1 flex gap-0.5">
                {value === "figma" && (
                  <DownloadButton text={code} filename="figma-tokens.json" />
                )}
                <CopyButton text={code} />
              </div>
              <pre className="max-h-40 overflow-auto p-3 pr-16 text-xs leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}