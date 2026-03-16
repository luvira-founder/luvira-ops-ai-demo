import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const tabs = ["Gradient ADK", "Managed KB", "Serverless Inference"];

export default function ChartHeader() {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <div className="flex flex-col-reverse gap-y-3 items-center justify-between xl:flex-row xl:gap-y-0">
      <ul className="flex gap-x-2 p-2 rounded-md bg-[#1c1d1f]">
        {tabs.map((tab, i) => (
          <li key={tab}>
            <Button
              variant="ghost"
              className={cn(
                "px-2 py-2.5 text-xs font-medium border-b-2 transition-colors border-transparent text-muted-foreground hover:text-foreground sm:px-5 sm:text-sm",
                {
                  "bg-gray-600/30 text-gray-200": currentTab === i,
                },
              )}
              onClick={() => setCurrentTab(i)}
            >
              {tab}
            </Button>
          </li>
        ))}
      </ul>
      <span className="text-sm text-muted-foreground sm:text-base">
        Powered by DigitalOcean Gradient AI
      </span>
    </div>
  );
}
