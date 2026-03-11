import { useState } from "react";
import { Sidebar } from "./components/dashboard/Sidebar";
import { Header } from "./components/dashboard/Header";
import { IncidentChart } from "./components/dashboard/IncidentChart";
import { RiskMeter } from "./components/dashboard/RiskMeter";
import { TraceWorkflow } from "./components/dashboard/TraceWorkflow";

function App() {
  const [isSimulating, setIsSimulating] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSimulate={() => setIsSimulating((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <IncidentChart isSimulating={isSimulating} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskMeter
              percentage={88}
              latency="1355ms"
              traceId="UVIRA-C67DC4"
            />
            <TraceWorkflow
              summary={[
                "Auth API error spike detected",
                "Error rate exceeded threshold",
              ]}
              steps={[
                { label: "Ingest Event", value: "120ms" },
                { label: "Policy Evaluation", value: "45ms" },
                { label: "KB Retrieval", value: "320ms" },
                { label: "AI Inference", value: "870ms" },
              ]}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
