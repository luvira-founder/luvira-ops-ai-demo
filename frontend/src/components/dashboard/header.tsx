import { useState } from "react";
import { Bell, ChevronDown, Loader, Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";
import { SidebarContent } from "./side-bar";
import { useSimulation } from "@/hooks/use-simulation";
import type { TIncidentRequestPayload } from "@/services/types";

const errorOptions: TIncidentRequestPayload[] = [
  {
    error_rate: 0.92,
    message: "Auth API error rate exceeding 85%",
    service_name: "Auth API",
  },
  {
    error_rate: 0.78,
    message: "Payment Gateway timeout rate spiking",
    service_name: "Payment Gateway",
  },
  {
    error_rate: 0.85,
    message: "User Service 5xx errors above threshold",
    service_name: "User Service",
  },
  {
    error_rate: 0.67,
    message: "Notification Service delivery failures",
    service_name: "Notification Service",
  },
  {
    error_rate: 0.91,
    message: "Search Index latency exceeding SLA",
    service_name: "Search Index",
  },
];

export function Header() {
  const { simulate, isPending } = useSimulation();
  const [selectedError, setSelectedError] = useState<TIncidentRequestPayload>(
    errorOptions[0],
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const onSimulateIncidentSpikeHandler = () => {
    simulate(selectedError);
  };

  const handleSelectChange = (serviceName: string) => {
    const found = errorOptions.find((e) => e.service_name === serviceName);
    if (found) setSelectedError(found);
  };

  return (
    <>
      {/* Mobile / Tablet header (below lg) */}
      <header className="lg:hidden border-b border-border px-4 py-3 bg-[#1c1d1f] max-[400px]:px-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 max-[400px]:gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground p-0"
              onClick={() => setSheetOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <img
              src="/assets/luvira-logo.png"
              alt="Luvira"
              className="h-7 w-auto max-[400px]:w-18"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={selectedError.service_name}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className="w-36 sm:w-44 bg-[#1c1d1f] border-2 border-gray-100/10 text-foreground text-xs max-[400px]:w-28">
                <SelectValue placeholder="Select error" />
              </SelectTrigger>
              <SelectContent className="bg-[#1c1d1f] border-gray-100/10">
                {errorOptions.map((opt) => (
                  <SelectItem
                    key={opt.service_name}
                    value={opt.service_name}
                    className="text-foreground focus:bg-white/5 focus:text-foreground"
                  >
                    {opt.service_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={onSimulateIncidentSpikeHandler}
              className="bg-brand hover:bg-brand-dark text-white font-medium px-3 sm:px-4 py-2.5 text-xs rounded-md"
            >
              {isPending ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <span className="hidden sm:inline">
                  Simulate Incident Spike
                </span>
              )}
              {!isPending && <span className="sm:hidden">Simulate</span>}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-sidebar border-gray-100/10"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavClick={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop header (lg and above) */}
      <header className="hidden lg:block border-b border-border px-6 bg-[#1c1d1f]">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-lg font-semibold text-foreground">
            Luvira Ops AI Mission Control (Overview)
          </h1>

          <div className="flex items-center gap-4">
            <Select
              value={selectedError.service_name}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className="w-52 bg-[#1c1d1f] border-2 border-gray-100/10 text-foreground">
                <SelectValue placeholder="Select error" />
              </SelectTrigger>
              <SelectContent className="bg-[#1c1d1f] border-gray-100/10">
                {errorOptions.map((opt) => (
                  <SelectItem
                    key={opt.service_name}
                    value={opt.service_name}
                    className="text-foreground focus:bg-white/5 focus:text-foreground"
                  >
                    {opt.service_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={onSimulateIncidentSpikeHandler}
              className="bg-brand hover:bg-brand-dark text-white font-medium px-6 py-5 min-w-40 rounded-md"
            >
              {isPending ? (
                <Loader className="size-6 animate-spin" />
              ) : (
                "Simulate Incident Spike"
              )}
            </Button>

            <Button variant="outline" size="icon">
              <Bell />
            </Button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="size-9 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium">
                G
              </div>
              <span className="text-sm text-foreground">Garfield</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
