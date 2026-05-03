"use client";

/**
 * Pure CSS/SVG chart components — no external charting library.
 * Supports BarChart, LineChart, and DonutChart.
 */

// ─── BAR CHART ───────────────────────────────────────────────
export function BarChart({
  data,
  height = 220,
  barColor = "#8B4513",
  locale = "ar",
}: {
  data: { label: string; value: number }[];
  height?: number;
  barColor?: string;
  locale?: "ar" | "en";
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end gap-2 h-full px-2">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <span className="text-xs text-charcoal-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {d.value}
              </span>
              <div className="w-full relative" style={{ height: height - 40 }}>
                <div
                  className="absolute bottom-0 inset-x-1 rounded-t-md transition-all duration-500 ease-out hover:brightness-110"
                  style={{
                    height: `${pct}%`,
                    background: `linear-gradient(180deg, ${barColor}, ${barColor}cc)`,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              </div>
              <span className="text-[10px] text-charcoal-500 text-center leading-tight truncate max-w-full">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LINE CHART ──────────────────────────────────────────────
export function LineChart({
  data,
  height = 180,
  lineColor = "#8B4513",
}: {
  data: { label: string; value: number }[];
  height?: number;
  lineColor?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 100;
  const h = height - 30;
  const padding = 10;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * (w - 2 * padding),
    y: h - padding - ((d.value / max) * (h - 2 * padding)),
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${h - padding} L ${points[0].x} ${h - padding} Z`;

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1={padding}
            y1={h - padding - frac * (h - 2 * padding)}
            x2={w - padding}
            y2={h - padding - frac * (h - 2 * padding)}
            stroke="#d4c5a9"
            strokeWidth={0.3}
          />
        ))}
        {/* Area fill */}
        <path d={areaD} fill={`${lineColor}15`} />
        {/* Line */}
        <path d={pathD} fill="none" stroke={lineColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={2.5} fill="white" stroke={lineColor} strokeWidth={1.2} />
            <title>{`${data[i].label}: ${data[i].value}`}</title>
          </g>
        ))}
      </svg>
      <div className="flex justify-between px-2 -mt-1">
        {data.map((d, i) => (
          <span key={i} className="text-[9px] text-charcoal-400">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

// ─── DONUT CHART ─────────────────────────────────────────────
export function DonutChart({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = "#2E7D32",
  label,
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e8e0d0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="font-heading text-xl font-bold text-charcoal">{Math.round(pct * 100)}%</span>
      </div>
      {label && <span className="text-xs text-charcoal-500">{label}</span>}
    </div>
  );
}
