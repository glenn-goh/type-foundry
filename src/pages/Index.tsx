import { useEffect } from "react";
import { AppConfigProvider, useAppConfig } from "@/context/AppConfigContext";
import { urlParamsToConfig } from "@/lib/scale-utils";
import ControlsPanel from "@/components/ControlsPanel";
import TypeScalePreview from "@/components/TypeScalePreview";
import LandingPagePreview from "@/components/LandingPagePreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

function UrlParamLoader() {
  const { updateConfig } = useAppConfig();

  useEffect(() => {
    const partial = urlParamsToConfig(window.location.search);
    if (partial) {
      updateConfig(partial);
      // Clean URL after loading
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return null;
}

function AppShell() {
  return (
    <div className="flex h-screen w-screen overflow-hidden flex-col bg-background lg:flex-row">
      <UrlParamLoader />
      {/* Left: Controls — fixed width on desktop, full-width collapsible on mobile */}
      <aside className="w-full shrink-0 border-b border-border bg-muted/40 lg:w-64 lg:min-w-[16rem] lg:max-w-[16rem] lg:border-b-0 lg:border-r">
        <ScrollArea className="h-full max-h-[40vh] lg:max-h-screen">
          <ControlsPanel />
        </ScrollArea>
      </aside>

      {/* Center + Right: fill all remaining space */}
      <div className="flex-1 min-w-0 min-h-0 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="h-full overflow-auto">
              <TypeScalePreview />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="h-full overflow-auto">
              <LandingPagePreview />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
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
