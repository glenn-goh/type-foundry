import { AppConfigProvider } from "@/context/AppConfigContext";
import ControlsPanel from "@/components/ControlsPanel";
import TypeScalePreview from "@/components/TypeScalePreview";
import LandingPagePreview from "@/components/LandingPagePreview";
import { ScrollArea } from "@/components/ui/scroll-area";

function AppShell() {
  return (
    <div className="flex h-screen flex-col bg-background lg:flex-row">
      {/* Left: Controls */}
      <aside className="w-full shrink-0 border-b border-border lg:w-72 lg:border-b-0 lg:border-r">
        <ScrollArea className="h-full max-h-[40vh] lg:max-h-screen">
          <ControlsPanel />
        </ScrollArea>
      </aside>

      {/* Center: Type Scale Preview */}
      <main className="flex-1 border-b border-border lg:border-b-0 lg:border-r">
        <TypeScalePreview />
      </main>

      {/* Right: Live Landing Page Preview */}
      <section className="flex-1 min-h-[40vh]">
        <LandingPagePreview />
      </section>
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
