import { useState } from "react";
import { ChevronDown, ChevronUp, Terminal } from "lucide-react";
import { IncidentChart } from "../components/dashboard/incident-chart";
import { RiskMeter } from "../components/dashboard/risk-meter";
import { TraceWorkflow } from "../components/dashboard/track-workflow";
import ChartHeader from "../components/dashboard/chart-header";
import { useSimulation } from "@/hooks/use-simulation";

export default function Overview() {
  const { data, isPending } = useSimulation();
  const [showRaw, setShowRaw] = useState(false);

  const riskScore = data ? Math.round(data.risk.score * 100) : 0;
  const latency = data ? `${data.observability.latency_ms}ms` : "--";
  const traceId = data?.observability.trace_id ?? "--";

  const summary = data
    ? [data.analysis]
    : ["No incident data yet", "Simulate an incident to see results"];

  const steps = data
    ? [
        {
          label: "Ingest Event",
          value: `${data.observability.trace_steps.ingest_event}ms`,
        },
        {
          label: "Policy Evaluation",
          value: `${data.observability.trace_steps.policy_evaluation}ms`,
        },
        {
          label: "KB Retrieval",
          value: `${data.observability.trace_steps.kb_retrieval}ms`,
        },
        {
          label: "AI Inference",
          value: `${data.observability.trace_steps.ai_inference}ms`,
        },
      ]
    : [
        { label: "Ingest Event", value: "--" },
        { label: "Policy Evaluation", value: "--" },
        { label: "KB Retrieval", value: "--" },
        { label: "AI Inference", value: "--" },
      ];

  const rawSnapshot = data
    ? {
        risk_score: data.risk.score,
        triggered: data.risk.triggered,
        trace_id: data.observability.trace_id,
        latency_ms: data.observability.latency_ms,
      }
    : null;

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-4">
      <ChartHeader />
      <IncidentChart isSimulating={isPending} />

      <div className="flex w-full gap-5">
        <RiskMeter percentage={riskScore} latency={latency} traceId={traceId} />
        <TraceWorkflow
          summary={summary}
          steps={steps}
          triggered={data?.risk.triggered}
          plan={data?.plan.steps}
        />
      </div>

      {rawSnapshot && (
        <div className="bg-[#1c1d1f] rounded-xl border-2 border-gray-100/10 overflow-hidden">
          <button
            onClick={() => setShowRaw((prev) => !prev)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <Terminal className="size-4" />
              Raw Backend Response
            </span>
            {showRaw ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </button>

          {showRaw && (
            <div className="px-5 pb-4">
              <pre className="text-sm text-brand font-mono bg-black/30 rounded-lg p-4 overflow-x-auto">
                {JSON.stringify(rawSnapshot, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
