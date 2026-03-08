import { AppConfigProvider } from "@/context/AppConfigContext";
import ControlsPanel from "@/components/ControlsPanel";
import TypeScalePreview from "@/components/TypeScalePreview";
import LandingPagePreview from "@/components/LandingPagePreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

function AppShell() {
  return (
    <div className="flex h-screen flex-col bg-background lg:flex-row">
      {/* Left: Controls */}
      <aside className="w-full shrink-0 border-b border-border lg:w-72 lg:border-b-0 lg:border-r">
        <ScrollArea className="h-full max-h-[40vh] lg:max-h-screen">
          <ControlsPanel />
        </ScrollArea>
      </aside>

      {/* Center + Right: Resizable split */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={25}>
            <TypeScalePreview />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={25}>
            <LandingPagePreview />
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
