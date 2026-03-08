import { useAppConfig } from "@/context/AppConfigContext";
import { SCALE_RATIOS, FONT_FAMILIES, type RoundingGrid } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, Sun, Moon, Minus, Plus } from "lucide-react";

export default function ControlsPanel() {
  const { config, updateConfig, updateBody, updateHeadings, updateResponsive, resetConfig } = useAppConfig();

  return (
    <div className="space-y-6 p-4 text-sm">
      {/* Theme toggle */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">Type Scale</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateConfig({ theme: config.theme === "light" ? "dark" : "light" })}
          >
            {config.theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetConfig}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Base Font Size */}
      <div className="space-y-2">
        <Label>Base Font Size</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => updateConfig({ baseFontSize: Math.max(10, config.baseFontSize - 1) })}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            min={10}
            max={24}
            value={config.baseFontSize}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= 10 && v <= 24) updateConfig({ baseFontSize: v });
            }}
            className="h-8 text-center"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => updateConfig({ baseFontSize: Math.min(24, config.baseFontSize + 1) })}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <span className="text-muted-foreground text-xs">px</span>
        </div>
      </div>

      {/* Scale Ratio */}
      <div className="space-y-2">
        <Label>Scale Ratio</Label>
        <Select
          value={String(config.scaleRatio)}
          onValueChange={(v) => updateConfig({ scaleRatio: Number(v) })}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SCALE_RATIOS.map((r) => (
              <SelectItem key={r.value} value={String(r.value)}>
                {r.label} — {r.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Unit */}
      <div className="space-y-2">
        <Label>Display Unit</Label>
        <div className="flex gap-1">
          {(["rem", "px", "pt"] as const).map((u) => (
            <Button
              key={u}
              variant={config.unit === u ? "default" : "outline"}
              size="sm"
              className="h-7 flex-1 text-xs"
              onClick={() => updateConfig({ unit: u })}
            >
              {u}
            </Button>
          ))}
        </div>
      </div>

      {/* Rounding */}
      <div className="space-y-2">
        <Label>Rounding</Label>
        <div className="flex gap-1">
          {([["none", "Off"], ["4px", "4px"], ["8px", "8px"]] as const).map(([value, label]) => (
            <Button
              key={value}
              variant={config.rounding === value ? "default" : "outline"}
              size="sm"
              className="h-7 flex-1 text-xs"
              onClick={() => updateConfig({ rounding: value as RoundingGrid })}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Body Settings */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Body Settings</Label>
        <div className="space-y-2">
          <Label className="text-xs">Font Family</Label>
          <Select value={config.body.fontFamily} onValueChange={(v) => updateBody({ fontFamily: v })}>
            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Weight: {config.body.fontWeight}</Label>
          <Slider
            min={100} max={900} step={100}
            value={[config.body.fontWeight]}
            onValueChange={([v]) => updateBody({ fontWeight: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Line Height</Label>
            <Input type="number" step={0.1} min={1} max={3} value={config.body.lineHeight}
              onChange={(e) => updateBody({ lineHeight: Number(e.target.value) })} className="h-8" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Letter Spacing</Label>
            <Input type="number" step={0.01} value={config.body.letterSpacing}
              onChange={(e) => updateBody({ letterSpacing: Number(e.target.value) })} className="h-8" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Text Color</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={config.body.textColor}
                onChange={(e) => updateBody({ textColor: e.target.value })}
                className="h-8 w-8 cursor-pointer rounded border border-input" />
              <span className="text-xs text-muted-foreground">{config.body.textColor}</span>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Background</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={config.body.backgroundColor}
                onChange={(e) => updateBody({ backgroundColor: e.target.value })}
                className="h-8 w-8 cursor-pointer rounded border border-input" />
              <span className="text-xs text-muted-foreground">{config.body.backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Heading Settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Heading Settings</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Inherit</span>
            <Switch checked={config.headings.inherit} onCheckedChange={(v) => updateHeadings({ inherit: v })} />
          </div>
        </div>
        {!config.headings.inherit && (
          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs">Font Family</Label>
              <Select value={config.headings.fontFamily} onValueChange={(v) => updateHeadings({ fontFamily: v })}>
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Weight: {config.headings.fontWeight}</Label>
              <Slider min={100} max={900} step={100}
                value={[config.headings.fontWeight]}
                onValueChange={([v]) => updateHeadings({ fontWeight: v })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Line Height</Label>
                <Input type="number" step={0.05} min={0.8} max={2} value={config.headings.lineHeight}
                  onChange={(e) => updateHeadings({ lineHeight: Number(e.target.value) })} className="h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Letter Spacing</Label>
                <Input type="number" step={0.01} value={config.headings.letterSpacing}
                  onChange={(e) => updateHeadings({ letterSpacing: Number(e.target.value) })} className="h-8" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={config.headings.color}
                  onChange={(e) => updateHeadings({ color: e.target.value })}
                  className="h-8 w-8 cursor-pointer rounded border border-input" />
                <span className="text-xs text-muted-foreground">{config.headings.color}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Responsive Settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Responsive</Label>
          <Switch checked={config.responsive.enabled} onCheckedChange={(v) => updateResponsive({ enabled: v })} />
        </div>
        {config.responsive.enabled && (
          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs">Min Width (px)</Label>
              <Input type="number" value={config.responsive.minWidth}
                onChange={(e) => updateResponsive({ minWidth: Number(e.target.value) })} className="h-8" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Base Font Size (px)</Label>
              <Input type="number" min={10} max={24}
                value={config.responsive.baseFontSize ?? ""}
                placeholder="Same as main"
                onChange={(e) => updateResponsive({ baseFontSize: e.target.value ? Number(e.target.value) : null })}
                className="h-8" />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Inherit Scale Ratio</Label>
              <Switch checked={config.responsive.inheritRatio}
                onCheckedChange={(v) => updateResponsive({ inheritRatio: v })} />
            </div>
            {!config.responsive.inheritRatio && (
              <div className="space-y-1">
                <Label className="text-xs">Scale Ratio</Label>
                <Select
                  value={String(config.responsive.scaleRatio ?? config.scaleRatio)}
                  onValueChange={(v) => updateResponsive({ scaleRatio: Number(v) })}
                >
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SCALE_RATIOS.map((r) => (
                      <SelectItem key={r.value} value={String(r.value)}>{r.label} — {r.value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
