import { useState } from "react";
import { useAppConfig } from "@/context/AppConfigContext";
import { SCALE_RATIOS, PRESETS, type RoundingGrid } from "@/lib/types";
import { configToUrlParams } from "@/lib/scale-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RotateCcw, Sun, Moon, Minus, Plus, Share2, Save, Trash2, Copy, Check, Type } from "lucide-react";
import FontSelector from "@/components/FontSelector";

export default function ControlsPanel() {
  const {
    config, updateConfig, updateBody, updateHeadings, updateResponsive,
    updateCompare, resetConfig, applyPreset, savedSystems, saveSystem, loadSystem, deleteSystem,
  } = useAppConfig();

  const [saveName, setSaveName] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [isCustomRatio, setIsCustomRatio] = useState(false);

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
    return `https://type-foundry.vercel.app/?${params}`;
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
    const preset = PRESETS[key];
    // Preserve current theme colors when in dark mode
    const isDark = config.theme === "dark";
    const filteredConfig = { ...preset.config };
    if (isDark && filteredConfig.body) {
      const { textColor, backgroundColor, ...restBody } = filteredConfig.body;
      filteredConfig.body = restBody as any;
    }
    if (isDark && filteredConfig.headings) {
      const { color, ...restHeadings } = filteredConfig.headings;
      filteredConfig.headings = restHeadings as any;
    }
    applyPreset(filteredConfig);
    setActiveSource(preset.label);
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
    <div className="flex flex-col h-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset all settings?</AlertDialogTitle>
            <AlertDialogDescription>
              This will revert all typography settings back to their defaults. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { const currentTheme = config.theme; resetConfig(); setActiveSource(null); setIsCustomRatio(false); /* Restore current theme mode */ if (currentTheme === "dark") { updateConfig({ theme: "dark" }); updateBody({ textColor: "#E5E7EB", backgroundColor: "#111318" }); updateHeadings({ color: "#F3F4F6" }); } }}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      {/* Persistent Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0"
        style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
        <div className="flex items-center gap-2">
          <Type className="h-3.5 w-3.5" style={{ color: 'hsl(var(--sidebar-accent))' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', fontWeight: 500, color: 'hsl(var(--sidebar-foreground))', letterSpacing: '0.02em' }}>
            Type Foundry
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShareOpen(true)} title="Share"
            style={{ color: 'hsl(var(--sidebar-muted))' }}>
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost" size="icon" className="h-7 w-7"
            style={{ color: 'hsl(var(--sidebar-muted))' }}
            onClick={() => {
              const willBeDark = config.theme === "light";
              updateConfig({ theme: willBeDark ? "dark" : "light" });
              updateBody({ textColor: willBeDark ? "#E5E7EB" : "#222222", backgroundColor: willBeDark ? "#111318" : "#FFFFFF" });
              updateHeadings({ color: willBeDark ? "#F3F4F6" : "#222222" });
            }}
          >
            {config.theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Accordion Sections */}
      <Accordion type="multiple" defaultValue={["scale", "body", "headings"]} className="flex-1 overflow-auto">

        {/* ── SCALE ── */}
        <AccordionItem value="scale" className="border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--sidebar-muted))' }}>
            Scale
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1 space-y-3">

            {/* Base Font Size */}
            <div className="space-y-1.5">
              <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Base Font Size</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-7 w-7 shrink-0 border"
                  style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))' }}
                  onClick={() => wrappedUpdateConfig({ baseFontSize: Math.max(10, config.baseFontSize - 1) })}>
                  <Minus className="h-3 w-3" />
                </Button>
                <div className="flex h-7 flex-1 items-center justify-center rounded-md border"
                  style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'hsl(var(--sidebar-foreground))' }}>
                  {config.baseFontSize}
                </div>
                <Button variant="outline" size="icon" className="h-7 w-7 shrink-0 border"
                  style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))' }}
                  onClick={() => wrappedUpdateConfig({ baseFontSize: Math.min(24, config.baseFontSize + 1) })}>
                  <Plus className="h-3 w-3" />
                </Button>
                <span style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))' }}>px</span>
              </div>
            </div>

            {/* Scale Ratio */}
            <div className="space-y-1.5">
              <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Scale Ratio</label>
              <Select
                value={!isCustomRatio && SCALE_RATIOS.some((r) => r.value === config.scaleRatio) ? String(config.scaleRatio) : "custom"}
                onValueChange={(v) => {
                  if (v === "custom") { setIsCustomRatio(true); }
                  else { setIsCustomRatio(false); wrappedUpdateConfig({ scaleRatio: Number(v) }); }
                }}
              >
                <SelectTrigger className="h-7 border" style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }}>
                  <SelectValue>
                    {!isCustomRatio && SCALE_RATIOS.some((r) => r.value === config.scaleRatio)
                      ? `${config.scaleRatio} — ${SCALE_RATIOS.find((r) => r.value === config.scaleRatio)?.label}`
                      : `${config.scaleRatio} — Custom`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SCALE_RATIOS.map((r) => (
                    <SelectItem key={r.value} value={String(r.value)} className="text-xs font-mono">{r.value} — {r.label}</SelectItem>
                  ))}
                  <SelectItem value="custom" className="text-xs">Custom...</SelectItem>
                </SelectContent>
              </Select>
              {isCustomRatio && (
                <Input
                  type="number" step={0.001} min={1} max={3} value={config.scaleRatio}
                  onChange={(e) => { const v = Number(e.target.value); if (v >= 1 && v <= 3) wrappedUpdateConfig({ scaleRatio: Math.round(v * 1000) / 1000 }); }}
                  className="h-7 border" placeholder="e.g. 1.333"
                  style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }} />
              )}
            </div>

            {/* Unit + Rounding */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Unit</label>
                <div className="flex gap-0.5">
                  {(["rem", "px", "pt"] as const).map((u) => (
                    <button key={u}
                      onClick={() => updateConfig({ unit: u })}
                      className="flex-1 h-6 rounded text-[10px] font-medium transition-colors"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        backgroundColor: config.unit === u ? 'hsl(var(--sidebar-accent))' : 'hsl(var(--sidebar-surface))',
                        color: config.unit === u ? 'hsl(var(--sidebar-background))' : 'hsl(var(--sidebar-muted))',
                        border: `1px solid ${config.unit === u ? 'hsl(var(--sidebar-accent))' : 'hsl(var(--sidebar-border))'}`,
                      }}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Rounding</label>
                <div className="flex gap-0.5">
                  {([["none", "Off"], ["4px", "4"], ["8px", "8"]] as const).map(([value, label]) => (
                    <button key={value}
                      onClick={() => updateConfig({ rounding: value as RoundingGrid })}
                      className="flex-1 h-6 rounded text-[10px] font-medium transition-colors"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        backgroundColor: config.rounding === value ? 'hsl(var(--sidebar-accent))' : 'hsl(var(--sidebar-surface))',
                        color: config.rounding === value ? 'hsl(var(--sidebar-background))' : 'hsl(var(--sidebar-muted))',
                        border: `1px solid ${config.rounding === value ? 'hsl(var(--sidebar-accent))' : 'hsl(var(--sidebar-border))'}`,
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Compare Mode */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))' }}>Compare Mode</label>
                <Switch checked={config.compare.enabled} onCheckedChange={(v) => updateCompare({ enabled: v })}
                  className="data-[state=unchecked]:bg-black/20 dark:data-[state=unchecked]:bg-white/15 data-[state=checked]:bg-[#AD791F] dark:data-[state=checked]:bg-[#E2A336]" />
              </div>
              {config.compare.enabled && (
                <div className="space-y-1.5">
                  <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Compare Ratio</label>
                  <Select
                    value={SCALE_RATIOS.some((r) => r.value === config.compare.scaleRatio) ? String(config.compare.scaleRatio) : "custom-compare"}
                    onValueChange={(v) => { if (v !== "custom-compare") updateCompare({ scaleRatio: Number(v) }); }}
                  >
                    <SelectTrigger className="h-7 border" style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }}>
                      <SelectValue>
                        {SCALE_RATIOS.some((r) => r.value === config.compare.scaleRatio)
                          ? `${config.compare.scaleRatio} — ${SCALE_RATIOS.find((r) => r.value === config.compare.scaleRatio)?.label}`
                          : `${config.compare.scaleRatio} — Custom`}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {SCALE_RATIOS.map((r) => (
                        <SelectItem key={r.value} value={String(r.value)} className="text-xs font-mono">{r.value} — {r.label}</SelectItem>
                      ))}
                      <SelectItem value="custom-compare" className="text-xs">Custom...</SelectItem>
                    </SelectContent>
                  </Select>
                  {!SCALE_RATIOS.some((r) => r.value === config.compare.scaleRatio) && (
                    <Input
                      type="number" step={0.001} min={1} max={3} value={config.compare.scaleRatio}
                      onChange={(e) => { const v = Number(e.target.value); if (v >= 1 && v <= 3) updateCompare({ scaleRatio: Math.round(v * 1000) / 1000 }); }}
                      className="h-7 border" placeholder="e.g. 1.333"
                      style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }} />
                  )}
                </div>
              )}
            </div>

            {/* Reset */}
            <button
              onClick={() => setResetOpen(true)}
              className="flex items-center gap-1.5 transition-opacity hover:opacity-100"
              style={{ fontSize: '10px', color: 'hsl(var(--sidebar-muted))', opacity: 0.6 }}>
              <RotateCcw className="h-3 w-3" />
              Reset to defaults
            </button>

          </AccordionContent>
        </AccordionItem>

        {/* ── BODY ── */}
        <AccordionItem value="body" className="border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--sidebar-muted))' }}>
            Body
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1 space-y-3">

            <div className="space-y-1.5">
              <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Font Family</label>
              <FontSelector value={config.body.fontFamily} onValueChange={(v) => wrappedUpdateBody({ fontFamily: v })} />
            </div>

            <div className="space-y-1.5">
              <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>
                Weight: <span style={{ fontFamily: "'DM Mono', monospace" }}>{config.body.fontWeight}</span>
              </label>
              <Slider min={100} max={900} step={100} value={[config.body.fontWeight]}
                onValueChange={([v]) => wrappedUpdateBody({ fontWeight: v })} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Line Height</label>
                <Input type="number" step={0.1} min={1} max={3} value={config.body.lineHeight}
                  onChange={(e) => wrappedUpdateBody({ lineHeight: Number(e.target.value) })}
                  className="h-7 border"
                  style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }} />
              </div>
              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Letter Spacing</label>
                <Input type="number" step={0.01} value={config.body.letterSpacing}
                  onChange={(e) => wrappedUpdateBody({ letterSpacing: Number(e.target.value) })}
                  className="h-7 border"
                  style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Text Color</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={config.body.textColor}
                    onChange={(e) => wrappedUpdateBody({ textColor: e.target.value })}
                    className="h-6 w-6 cursor-pointer rounded border"
                    style={{ borderColor: 'hsl(var(--sidebar-border))' }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'hsl(var(--sidebar-muted))' }}>
                    {config.body.textColor}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Background</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={config.body.backgroundColor}
                    onChange={(e) => wrappedUpdateBody({ backgroundColor: e.target.value })}
                    className="h-6 w-6 cursor-pointer rounded border"
                    style={{ borderColor: 'hsl(var(--sidebar-border))' }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'hsl(var(--sidebar-muted))' }}>
                    {config.body.backgroundColor}
                  </span>
                </div>
              </div>
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* ── HEADINGS ── */}
        <AccordionItem value="headings" className="border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--sidebar-muted))' }}>
            Headings
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1 space-y-3">

            <div className="flex items-center justify-between">
              <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))' }}>Inherit body</label>
              <Switch checked={config.headings.inherit} onCheckedChange={(v) => wrappedUpdateHeadings({ inherit: v })}
                className="data-[state=unchecked]:bg-black/20 dark:data-[state=unchecked]:bg-white/15 data-[state=checked]:bg-[#AD791F] dark:data-[state=checked]:bg-[#E2A336]" />
            </div>

            {!config.headings.inherit && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Font Family</label>
                  <FontSelector value={config.headings.fontFamily} onValueChange={(v) => wrappedUpdateHeadings({ fontFamily: v })} />
                </div>
                <div className="space-y-1.5">
                  <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>
                    Weight: <span style={{ fontFamily: "'DM Mono', monospace" }}>{config.headings.fontWeight}</span>
                  </label>
                  <Slider min={100} max={900} step={100} value={[config.headings.fontWeight]}
                    onValueChange={([v]) => wrappedUpdateHeadings({ fontWeight: v })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Line Height</label>
                    <Input type="number" step={0.05} min={0.8} max={2} value={config.headings.lineHeight}
                      onChange={(e) => wrappedUpdateHeadings({ lineHeight: Number(e.target.value) })}
                      className="h-7 border"
                      style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }} />
                  </div>
                  <div className="space-y-1.5">
                    <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Letter Spacing</label>
                    <Input type="number" step={0.01} value={config.headings.letterSpacing}
                      onChange={(e) => wrappedUpdateHeadings({ letterSpacing: Number(e.target.value) })}
                      className="h-7 border"
                      style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '11px' }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Color</label>
                  <div className="flex items-center gap-1.5">
                    <input type="color" value={config.headings.color}
                      onChange={(e) => wrappedUpdateHeadings({ color: e.target.value })}
                      className="h-6 w-6 cursor-pointer rounded border"
                      style={{ borderColor: 'hsl(var(--sidebar-border))' }} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'hsl(var(--sidebar-muted))' }}>
                      {config.headings.color}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </AccordionContent>
        </AccordionItem>

        {/* ── ADVANCED ── */}
        <AccordionItem value="advanced" className="border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--sidebar-muted))' }}>
            Advanced
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1 space-y-4">

            {/* Responsive */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label style={{ fontSize: '11px', color: 'hsl(var(--sidebar-muted))' }}>Responsive</label>
                <Switch checked={config.responsive.enabled} onCheckedChange={(v) => updateResponsive({ enabled: v })}
                  className="data-[state=unchecked]:bg-black/20 dark:data-[state=unchecked]:bg-white/15 data-[state=checked]:bg-[#AD791F] dark:data-[state=checked]:bg-[#E2A336]" />
              </div>
              {config.responsive.enabled && (
                <div className="space-y-2">
                  {config.responsive.breakpoints.map((bp, i) => (
                    <div key={i} className="space-y-1.5 rounded-md border p-2"
                      style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: 'hsl(var(--sidebar-foreground))' }}>{bp.label}</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { label: 'Min Width', key: 'minWidth' as const, step: 1 },
                          { label: 'Base', key: 'baseFontSize' as const, step: 1 },
                          { label: 'Ratio', key: 'scaleRatio' as const, step: 0.001 },
                        ].map(({ label, key, step }) => (
                          <div key={key} className="space-y-0.5">
                            <span style={{ fontSize: '9px', color: 'hsl(var(--sidebar-muted))' }}>{label}</span>
                            <Input type="number" step={step} value={bp[key]}
                              onChange={(e) => {
                                const bps = [...config.responsive.breakpoints];
                                bps[i] = { ...bps[i], [key]: Number(e.target.value) };
                                updateResponsive({ breakpoints: bps });
                              }}
                              className="h-6 border px-1.5"
                              style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-background))', color: 'hsl(var(--sidebar-foreground))', fontFamily: "'DM Mono', monospace", fontSize: '10px' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Library */}
            <div className="space-y-2">
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'hsl(var(--sidebar-muted))', display: 'block' }}>Presets</label>
              <Select value={activePresetKey ?? "custom"} onValueChange={(v) => { if (v !== "custom") handleApplyPreset(v); }}>
                <SelectTrigger className="h-7 border" style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontSize: '11px' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="py-1">
                  <SelectItem value="custom" className="py-2 pl-3 pr-8">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Custom</span>
                      <span className="text-[10px] text-muted-foreground">{config.baseFontSize}px · {config.scaleRatio}</span>
                    </div>
                  </SelectItem>
                  {Object.entries(PRESETS).map(([key, preset]) => (
                    <SelectItem key={key} value={key} className="py-2 pl-3 pr-8">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{preset.label}</span>
                        <span className="text-[10px] text-muted-foreground">{preset.config.baseFontSize}px · {preset.config.scaleRatio}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'hsl(var(--sidebar-muted))', display: 'block' }}>
                Saved <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px' }}>({savedSystems.length})</span>
              </label>
              <div className="flex gap-1.5">
                <Input placeholder="System name..." value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  className="h-7 border flex-1"
                  style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))', fontSize: '11px' }} />
                <Button variant="outline" size="sm" className="h-7 shrink-0 border text-xs"
                  style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))', color: 'hsl(var(--sidebar-foreground))' }}
                  onClick={handleSave} disabled={!saveName.trim()}>
                  <Save className="mr-1 h-3 w-3" />Save
                </Button>
              </div>
              {savedSystems.map((sys) => (
                <div key={sys.id} className="flex items-center justify-between rounded-md border px-2 py-1.5"
                  style={{ borderColor: 'hsl(var(--sidebar-border))', backgroundColor: 'hsl(var(--sidebar-surface))' }}>
                  <button onClick={() => handleLoadSystem(sys.id)} className="text-left">
                    <span className="block text-xs font-medium hover:underline" style={{ color: 'hsl(var(--sidebar-foreground))' }}>{sys.name}</span>
                    <span className="block" style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'hsl(var(--sidebar-muted))' }}>
                      {(sys.config as any).baseFontSize}px · {(sys.config as any).scaleRatio}
                    </span>
                  </button>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => deleteSystem(sys.id)}>
                    <Trash2 className="h-3 w-3" style={{ color: 'hsl(var(--sidebar-muted))' }} />
                  </Button>
                </div>
              ))}
            </div>

          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
