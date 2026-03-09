import { useMemo, useState } from "react";
import { useAppConfig } from "@/context/AppConfigContext";
import { calculateTypeScale, generateCssVariables, generateJsonTokens, generateTailwindConfig, generateFigmaTokens, generateResponsiveCss } from "@/lib/scale-utils";
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
    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleCopy} title="Copy to clipboard">
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
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
    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleDownload} title={`Download ${filename}`}>
      <Download className="h-3 w-3" />
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
      scale: calculateTypeScale(base, ratio, config.rounding, config.steps),
      minWidth: config.responsive.minWidth,
    };
  }, [config]);

  const cssCode = useMemo(() => {
    if (config.responsive.enabled && config.responsive.breakpoints.length > 0) {
      return generateResponsiveCss(config.responsive.breakpoints, config.unit, config.rounding, config.steps);
    }
    return generateCssVariables(scale, config.unit, responsiveData);
  }, [scale, config.unit, responsiveData, config.responsive, config.rounding]);

  const jsonCode = useMemo(() => generateJsonTokens(scale, config.unit), [scale, config.unit]);
  const twCode = useMemo(() => generateTailwindConfig(scale, config.unit), [scale, config.unit]);
  const figmaCode = useMemo(
    () => generateFigmaTokens(scale, config.unit, config.body, config.headings),
    [scale, config.unit, config.body, config.headings]
  );

  return (
    <div className="border-t border-border">
      <Tabs defaultValue="css" className="w-full">
        <div className="flex items-center justify-between px-4 pt-1.5">
          <TabsList className="h-7">
            <TabsTrigger value="css" className="text-[10px] px-2.5 h-5">CSS</TabsTrigger>
            <TabsTrigger value="json" className="text-[10px] px-2.5 h-5">JSON</TabsTrigger>
            <TabsTrigger value="tailwind" className="text-[10px] px-2.5 h-5">Tailwind</TabsTrigger>
            <TabsTrigger value="figma" className="text-[10px] px-2.5 h-5">Figma</TabsTrigger>
          </TabsList>
        </div>
        {[
          { value: "css", code: cssCode },
          { value: "json", code: jsonCode },
          { value: "tailwind", code: twCode },
          { value: "figma", code: figmaCode },
        ].map(({ value, code }) => (
          <TabsContent key={value} value={value} className="mt-0 px-4 pb-2">
            {value === "figma" && (
              <p className="mb-1.5 text-[10px] text-muted-foreground">
                Import via{" "}
                <a href="https://www.figma.com/community/plugin/843461159747178978" target="_blank" rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground">Tokens Studio for Figma</a>
                {" "}plugin → Load → paste JSON or import the downloaded file.
              </p>
            )}
            <div className="relative rounded-md border border-border bg-muted/50">
              <div className="absolute right-1 top-1 flex gap-0.5">
                {value === "figma" && <DownloadButton text={code} filename="figma-tokens.json" />}
                <CopyButton text={code} />
              </div>
              <pre className="max-h-32 overflow-auto p-2.5 pr-14 text-[10px] leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
