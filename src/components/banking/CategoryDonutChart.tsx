import { Circle, G, Svg } from "react-native-svg";

export interface CategoryDonutSegment {
  id: string;
  /** Share of the total, 0-100. All segments' percents should sum to ~100. */
  percent: number;
  color: string;
}

export interface CategoryDonutChartProps {
  segments: CategoryDonutSegment[];
  size?: number;
}

const STROKE_WIDTH = 28;

/**
 * Hand-rolled SVG ring chart (ADR-007 — charts are hand-rolled on `react-native-svg`, no charting
 * library) for the copilot "2.4_see insighs" Top Categories card (Figma node 279:2077, six stacked
 * `Ellipse` arcs approximated here as one stroked circle per segment via `strokeDasharray`/
 * `strokeDashoffset`, rotated -90° so the first segment starts at 12 o'clock like the Figma mock).
 */
export function CategoryDonutChart({ segments, size = 130 }: CategoryDonutChartProps) {
  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {segments.map((segment) => {
          const length = (segment.percent / 100) * circumference;
          const offset = -((cumulativePercent / 100) * circumference);
          cumulativePercent += segment.percent;
          return (
            <Circle
              key={segment.id}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </G>
    </Svg>
  );
}

export default CategoryDonutChart;
