import { useState } from "react";
import { useAppConfig } from "@/context/AppConfigContext";
import { SCALE_RATIOS, FONT_FAMILIES, PRESETS, type RoundingGrid } from "@/lib/types";
import { configToUrlParams } from "@/lib/scale-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RotateCcw, Sun, Moon, Minus, Plus, Share2, Save, Trash2, ChevronDown, ChevronRight, Copy, Check } from "lucide-react";

export default function ControlsPanel() {
  const {
    config, updateConfig, updateBody, updateHeadings, updateResponsive,
    updateCompare, resetConfig, applyPreset, savedSystems, saveSystem, loadSystem, deleteSystem,
  } = useAppConfig();

  const [saveName, setSaveName] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSource, setActiveSource] = useState<string | null>(null);

  // Determine current active label
  const activeLabel = (() => {
    if (activeSource) return activeSource;
    // Check if current config matches a preset
    for (const [, preset] of Object.entries(PRESETS)) {
      if (config.baseFontSize === preset.config.baseFontSize && config.scaleRatio === preset.config.scaleRatio) {
        return preset.label;
      }
    }
    return "Custom";
  })();

  const activePresetKey = (() => {
    for (const [key, preset] of Object.entries(PRESETS)) {
      if (config.baseFontSize === preset.config.baseFontSize && config.scaleRatio === preset.config.scaleRatio) {
        return key;
      }
    }
    return null;
  })();

  const shareUrl = (() => {
    const params = configToUrlParams(config);
    return `${window.location.origin}${window.location.pathname}?${params}`;
  })();

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (saveName.trim()) {
      saveSystem(saveName.trim());
      setSaveName("");
    }
  };

  const handleApplyPreset = (key: string) => {
    applyPreset(PRESETS[key].config);
    setActiveSource(PRESETS[key].label);
  };

  const handleLoadSystem = (id: string) => {
    const sys = savedSystems.find((s) => s.id === id);
    loadSystem(id);
    if (sys) setActiveSource(sys.name);
  };

  // Clear active source when user manually changes settings
  const wrappedUpdateConfig = (partial: Partial<typeof config>) => {
    setActiveSource(null);
    updateConfig(partial);
  };
  const wrappedUpdateBody = (partial: Partial<typeof config.body>) => {
    setActiveSource(null);
    updateBody(partial);
  };
  const wrappedUpdateHeadings = (partial: Partial<typeof config.headings>) => {
    setActiveSource(null);
    updateHeadings(partial);
  };

  return (
    <div className="space-y-5 p-4 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">TypeForge</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShareOpen(true)} title="Share">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost" size="icon" className="h-7 w-7"
            onClick={() => {
              const isDark = config.theme === "light";
              updateConfig({
                theme: isDark ? "dark" : "light",
              });
              updateBody({
                textColor: isDark ? "#E5E7EB" : "#222222",
                backgroundColor: isDark ? "#111318" : "#FFFFFF",
              });
              updateHeadings({
                color: isDark ? "#F3F4F6" : "#222222",
              });
            }}
          >
            {config.theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetConfig}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Share Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Copy this link to share your current type scale settings.</p>
            <div className="flex items-center gap-2">
              <Input value={shareUrl} readOnly className="h-8 text-xs font-mono" />
              <Button variant="outline" size="sm" className="h-8 shrink-0" onClick={handleCopyShare}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Separator />

      {/* Library: Presets + Saved */}
      <div className="space-y-2">
        <button
          onClick={() => setShowLibrary(!showLibrary)}
          className="flex w-full items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          {showLibrary ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          Library
        </button>
        {showLibrary && (
          <div className="space-y-3">
            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Presets</span>
              <Select value={activePresetKey ?? "custom"} onValueChange={(v) => { if (v !== "custom") handleApplyPreset(v); }}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="py-1">
                  <SelectItem value="custom" className="py-2 pl-3 pr-8 [&>span:first-child]:left-auto [&>span:first-child]:right-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Custom</span>
                      <span className="text-[10px] text-muted-foreground">
                        {config.baseFontSize}px · {config.scaleRatio}
                      </span>
                    </div>
                  </SelectItem>
                  {Object.entries(PRESETS).map(([key, preset]) => (
                    <SelectItem key={key} value={key} className="py-2.5 pl-3 pr-8 [&>span:first-child]:left-auto [&>span:first-child]:right-2">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{preset.label}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {preset.config.baseFontSize}px · {preset.config.scaleRatio}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{preset.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Saved Systems */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Saved ({savedSystems.length})</span>
              <div className="flex gap-1.5">
                <Input placeholder="System name..." value={saveName}
                  onChange={(e) => setSaveName(e.target.value)} className="h-7 text-xs" />
                <Button variant="outline" size="sm" className="h-7 shrink-0 text-xs" onClick={handleSave} disabled={!saveName.trim()}>
                  <Save className="mr-1 h-3 w-3" />Save
                </Button>
              </div>
              {savedSystems.map((sys) => (
                <div key={sys.id} className="flex items-center justify-between rounded-md border border-border px-2 py-1.5">
                  <button onClick={() => handleLoadSystem(sys.id)} className="text-left">
                    <span className="block text-xs font-medium text-foreground hover:underline">{sys.name}</span>
                    <span className="block text-[10px] text-muted-foreground">
                      {(sys.config as any).baseFontSize}px · {(sys.config as any).scaleRatio}
                    </span>
                  </button>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => deleteSystem(sys.id)}>
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Base Font Size */}
      <div className="space-y-2">
        <Label className="text-xs">Base Font Size</Label>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-7 w-7 shrink-0"
            onClick={() => wrappedUpdateConfig({ baseFontSize: Math.max(10, config.baseFontSize - 1) })}>
            <Minus className="h-3 w-3" />
          </Button>
          <Input type="number" min={10} max={24} value={config.baseFontSize}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= 10 && v <= 24) wrappedUpdateConfig({ baseFontSize: v });
            }}
            className="h-7 text-center text-xs" />
          <Button variant="outline" size="icon" className="h-7 w-7 shrink-0"
            onClick={() => wrappedUpdateConfig({ baseFontSize: Math.min(24, config.baseFontSize + 1) })}>
            <Plus className="h-3 w-3" />
          </Button>
          <span className="text-muted-foreground text-xs">px</span>
        </div>
      </div>

      {/* Scale Ratio */}
      <div className="space-y-2">
        <Label className="text-xs">Scale Ratio</Label>
        <Select value={String(config.scaleRatio)} onValueChange={(v) => wrappedUpdateConfig({ scaleRatio: Number(v) })}>
          <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SCALE_RATIOS.map((r) => (
              <SelectItem key={r.value} value={String(r.value)}>{r.value} ({r.label})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Unit + Rounding */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Unit</Label>
          <div className="flex gap-0.5">
            {(["rem", "px", "pt"] as const).map((u) => (
              <Button key={u} variant={config.unit === u ? "default" : "outline"} size="sm"
                className="h-6 flex-1 text-[10px] px-1" onClick={() => updateConfig({ unit: u })}>
                {u}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Rounding</Label>
          <div className="flex gap-0.5">
            {([["none", "Off"], ["4px", "4"], ["8px", "8"]] as const).map(([value, label]) => (
              <Button key={value} variant={config.rounding === value ? "default" : "outline"} size="sm"
                className="h-6 flex-1 text-[10px] px-1" onClick={() => updateConfig({ rounding: value as RoundingGrid })}>
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Compare Mode */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compare Mode</Label>
          <Switch checked={config.compare.enabled} onCheckedChange={(v) => updateCompare({ enabled: v })} className="data-[state=unchecked]:bg-muted-foreground/30" />
        </div>
        {config.compare.enabled && (
          <Select value={String(config.compare.scaleRatio)} onValueChange={(v) => updateCompare({ scaleRatio: Number(v) })}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SCALE_RATIOS.map((r) => (
                <SelectItem key={r.value} value={String(r.value)}>{r.label} — {r.value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Separator />

      {/* Body Settings */}
      <div className="space-y-2.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Body Settings</Label>
        <div className="space-y-1.5">
          <Label className="text-[11px]">Font Family</Label>
          <Select value={config.body.fontFamily} onValueChange={(v) => wrappedUpdateBody({ fontFamily: v })}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px]">Weight: {config.body.fontWeight}</Label>
          <Slider min={100} max={900} step={100} value={[config.body.fontWeight]}
            onValueChange={([v]) => wrappedUpdateBody({ fontWeight: v })} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[11px]">Line Height</Label>
            <Input type="number" step={0.1} min={1} max={3} value={config.body.lineHeight}
              onChange={(e) => wrappedUpdateBody({ lineHeight: Number(e.target.value) })} className="h-7 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px]">Letter Spacing</Label>
            <Input type="number" step={0.01} value={config.body.letterSpacing}
              onChange={(e) => wrappedUpdateBody({ letterSpacing: Number(e.target.value) })} className="h-7 text-xs" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[11px]">Text Color</Label>
            <div className="flex items-center gap-1.5">
              <input type="color" value={config.body.textColor}
                onChange={(e) => wrappedUpdateBody({ textColor: e.target.value })}
                className="h-6 w-6 cursor-pointer rounded border border-input" />
              <span className="text-[10px] text-muted-foreground">{config.body.textColor}</span>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[11px]">Background</Label>
            <div className="flex items-center gap-1.5">
              <input type="color" value={config.body.backgroundColor}
                onChange={(e) => wrappedUpdateBody({ backgroundColor: e.target.value })}
                className="h-6 w-6 cursor-pointer rounded border border-input" />
              <span className="text-[10px] text-muted-foreground">{config.body.backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Heading Settings */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Heading Settings</Label>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">Inherit</span>
            <Switch checked={config.headings.inherit} onCheckedChange={(v) => wrappedUpdateHeadings({ inherit: v })} className="data-[state=unchecked]:bg-muted-foreground/30" />
          </div>
        </div>
        {!config.headings.inherit && (
          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-[11px]">Font Family</Label>
              <Select value={config.headings.fontFamily} onValueChange={(v) => wrappedUpdateHeadings({ fontFamily: v })}>
                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Weight: {config.headings.fontWeight}</Label>
              <Slider min={100} max={900} step={100} value={[config.headings.fontWeight]}
                onValueChange={([v]) => updateHeadings({ fontWeight: v })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[11px]">Line Height</Label>
                <Input type="number" step={0.05} min={0.8} max={2} value={config.headings.lineHeight}
                  onChange={(e) => updateHeadings({ lineHeight: Number(e.target.value) })} className="h-7 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Letter Spacing</Label>
                <Input type="number" step={0.01} value={config.headings.letterSpacing}
                  onChange={(e) => updateHeadings({ letterSpacing: Number(e.target.value) })} className="h-7 text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Color</Label>
              <div className="flex items-center gap-1.5">
                <input type="color" value={config.headings.color}
                  onChange={(e) => updateHeadings({ color: e.target.value })}
                  className="h-6 w-6 cursor-pointer rounded border border-input" />
                <span className="text-[10px] text-muted-foreground">{config.headings.color}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Responsive Settings */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Responsive</Label>
          <Switch checked={config.responsive.enabled} onCheckedChange={(v) => updateResponsive({ enabled: v })} className="data-[state=unchecked]:bg-muted-foreground/30" />
        </div>
        {config.responsive.enabled && (
          <div className="space-y-3">
            {config.responsive.breakpoints.map((bp, i) => (
              <div key={i} className="space-y-1.5 rounded-md border border-border p-2">
                <Label className="text-[11px] font-medium">{bp.label}</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[9px] text-muted-foreground">Min Width</span>
                    <Input type="number" value={bp.minWidth} className="h-6 text-[10px] px-1.5"
                      onChange={(e) => {
                        const bps = [...config.responsive.breakpoints];
                        bps[i] = { ...bps[i], minWidth: Number(e.target.value) };
                        updateResponsive({ breakpoints: bps });
                      }} />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[9px] text-muted-foreground">Base Size</span>
                    <Input type="number" value={bp.baseFontSize} min={10} max={24} className="h-6 text-[10px] px-1.5"
                      onChange={(e) => {
                        const bps = [...config.responsive.breakpoints];
                        bps[i] = { ...bps[i], baseFontSize: Number(e.target.value) };
                        updateResponsive({ breakpoints: bps });
                      }} />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[9px] text-muted-foreground">Ratio</span>
                    <Input type="number" step={0.001} value={bp.scaleRatio} className="h-6 text-[10px] px-1.5"
                      onChange={(e) => {
                        const bps = [...config.responsive.breakpoints];
                        bps[i] = { ...bps[i], scaleRatio: Number(e.target.value) };
                        updateResponsive({ breakpoints: bps });
                      }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
