import { Bell, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

interface HeaderProps {
  onSimulate: () => void;
}

const tabs = ["Gradient ADK", "Managed KB", "Serverless Inference"];

export function Header({ onSimulate }: HeaderProps) {
  return (
    <header className="border-b border-border px-6 bg-[#1c1d1f]">
      <div className="flex items-center justify-between h-16">
        <h1 className="text-lg font-semibold text-foreground">
          Luvira Ops AI Mission Control (Overview)
        </h1>

        <div className="flex items-center gap-4">
          <Button
            onClick={onSimulate}
            className="bg-brand hover:bg-brand-dark text-white font-medium px-6 rounded-md"
          >
            Simulate Incident Spike
          </Button>

          <Button variant="outline" size="icon">
            <Bell />
          </Button>
          {/* <button className="relative text-muted-foreground hover:text-foreground transition-colors">
            <Bell />
          </button> */}

          <div className="flex items-center gap-2 cursor-pointer">
            <div className="size-9 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium">
              G
            </div>
            <span className="text-sm text-foreground">Garfield</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between -mb-px">
        <div className="flex gap-0">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                i === 0
                  ? "border-brand text-foreground bg-secondary rounded-t-md"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          Powered by DigitalOcean Gradient AI
        </span>
      </div>
    </header>
  );
}
