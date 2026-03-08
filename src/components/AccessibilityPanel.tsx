import { useAppConfig } from "@/context/AppConfigContext";
import { getScaleDensity, getAccessibilityWarnings } from "@/lib/scale-utils";
import { AlertTriangle, Info } from "lucide-react";

export default function AccessibilityPanel() {
  const { config } = useAppConfig();

  const density = getScaleDensity(config.scaleRatio);
  const warnings = getAccessibilityWarnings(config);

  return (
    <div className="border-t border-border px-4 py-3 space-y-3">
      {/* Density indicator */}
      <div>
        <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scale Density</h3>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {density.label}
          </span>
          <span className="text-xs text-muted-foreground">{density.description}</span>
        </div>
      </div>

      {/* Accessibility warnings */}
      {warnings.length > 0 && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Accessibility</h3>
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-2 dark:border-yellow-900/50 dark:bg-yellow-900/20">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs text-yellow-800 dark:text-yellow-200">{w}</span>
            </div>
          ))}
        </div>
      )}

      {warnings.length === 0 && (
        <div className="flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-2 dark:border-green-900/50 dark:bg-green-900/20">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400" />
          <span className="text-xs text-green-800 dark:text-green-200">Typography settings look good for readability.</span>
        </div>
      )}
    </div>
  );
}
