interface RiskMeterProps {
  percentage: number;
  latency: string;
  traceId: string;
}

export function RiskMeter({ percentage, latency, traceId }: RiskMeterProps) {
  const radius = 90;
  const strokeWidth = 12;
  const center = 110;
  const startAngle = 135;
  const endAngle = 405;
  const totalAngle = endAngle - startAngle;
  const filledAngle = startAngle + (totalAngle * percentage) / 100;

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  const describeArc = (start: number, end: number) => {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  const dotPos = polarToCartesian(filledAngle);

  return (
    <div className="bg-[#1c1d1f] rounded-xl border border-border p-5">
      <h2 className="text-base font-semibold text-card-foreground mb-2">
        Risk Meter
      </h2>

      <div className="flex flex-col items-center">
        <svg width="220" height="180" viewBox="0 0 220 180">
          <path
            d={describeArc(startAngle, endAngle)}
            fill="none"
            stroke="#2e2e48"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d={describeArc(startAngle, filledAngle)}
            fill="none"
            stroke="#3bcaca"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle cx={dotPos.x} cy={dotPos.y} r={6} fill="#3bcaca" />
          <circle cx={dotPos.x} cy={dotPos.y} r={3} fill="#1e1e34" />
          <text
            x={center}
            y={center + 10}
            textAnchor="middle"
            fill="#e0e0e0"
            fontSize="42"
            fontWeight="bold"
          >
            {percentage}%
          </text>
        </svg>

        <div className="text-center -mt-2 space-y-1">
          <p className="text-sm text-muted-foreground">
            Total Latency:{" "}
            <span className="font-semibold text-foreground">{latency}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Trace ID:{" "}
            <span className="font-semibold text-foreground">{traceId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
