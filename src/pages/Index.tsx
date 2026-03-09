import { useEffect, useState } from "react";
import { AppConfigProvider, useAppConfig } from "@/context/AppConfigContext";
import { urlParamsToConfig } from "@/lib/scale-utils";
import ControlsPanel from "@/components/ControlsPanel";
import TypeScalePreview from "@/components/TypeScalePreview";
import LandingPagePreview from "@/components/LandingPagePreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";

function UrlParamLoader() {
  const { updateConfig } = useAppConfig();

  useEffect(() => {
    const partial = urlParamsToConfig(window.location.search);
    if (partial) {
      updateConfig(partial);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return null;
}

function AppShell() {
  const { config } = useAppConfig();
  const [previewCollapsed, setPreviewCollapsed] = useState(false);

  return (
    <div className={`flex h-screen w-screen overflow-hidden flex-col bg-background lg:flex-row${config.theme === "dark" ? " dark" : ""}`}>
      <UrlParamLoader />
      <aside
          className="w-full shrink-0 border-b lg:w-72 lg:min-w-[18rem] lg:max-w-[18rem] lg:border-b-0 lg:border-r"
          style={{ backgroundColor: 'hsl(var(--sidebar-background))', borderColor: 'hsl(var(--sidebar-border))' }}
        >
        <div className="h-full max-h-[40vh] lg:max-h-screen overflow-auto no-scrollbar">
          <ControlsPanel />
        </div>
      </aside>

      <div className="flex-1 min-w-0 min-h-0 overflow-hidden flex">
        <div className="flex-1 min-w-0 min-h-0 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel defaultSize={previewCollapsed ? 100 : 50} minSize={20}>
              <div className="h-full overflow-auto">
                <TypeScalePreview />
              </div>
            </ResizablePanel>
            {!previewCollapsed && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={20}>
                  <div className="h-full overflow-auto">
                    <LandingPagePreview onCollapse={() => setPreviewCollapsed(true)} />
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
        {previewCollapsed && (
          <div className="flex h-full flex-col items-center border-l px-1 pt-2 shrink-0"
            style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'rgba(0,0,0,0.05)' }}>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewCollapsed(false)} title="Expand live preview">
              <PanelRightOpen className="h-4 w-4" />
            </Button>
            <span className="mt-2 text-[10px] text-muted-foreground [writing-mode:vertical-rl] rotate-180">Live Preview</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <AppConfigProvider>
      <AppShell />
    </AppConfigProvider>
  );
}
