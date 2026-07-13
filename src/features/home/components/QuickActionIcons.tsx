import Svg, { Path } from "react-native-svg";

import { useAppTheme } from "@/design-system";

/**
 * Two-tone quick-action icons imported verbatim from Figma (node 340:1812,
 * "Quick actions animation"). These are drawn *filled* navy with white inner
 * accents — a look lucide's single-stroke icons can't reproduce — so they're
 * hand-ported as `react-native-svg` paths from the exported assets.
 *
 * The 16.08 viewBox and 1.34 stroke width are the raw Figma export values
 * (they scale to a ~1.33px stroke at the 16px render size, matching a lucide
 * icon at `size=16 strokeWidth=2`). Both colors resolve through the app theme
 * — `navy` (#0a1d48) for the body, `onAccent` (#fff) for the accents — so
 * nothing is hardcoded. The outline "Analyze spending" magnifier stays a
 * plain lucide `Search`; only the filled icons live here.
 */
export interface QuickActionIconProps {
  /** Pixel size (width = height). @default 16 */
  size?: number;
  /** Body fill/stroke color. @default theme `navy` */
  color?: string;
  /** Inner-accent stroke color. @default theme `onAccent` */
  accentColor?: string;
}

const VIEW_BOX = "0 0 16.08 16.08";
const STROKE_WIDTH = 1.34;

function useIconColors(color?: string, accentColor?: string) {
  const { colors } = useAppTheme();
  return { body: color ?? colors.navy, accent: accentColor ?? colors.onAccent };
}

export function MessageSquareMoreFilledIcon({ size = 16, color, accentColor }: QuickActionIconProps) {
  const { body, accent } = useIconColors(color, accentColor);
  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX} fill="none">
      <Path
        d="M14.74 11.39C14.74 11.7454 14.5988 12.0862 14.3475 12.3375C14.0962 12.5888 13.7554 12.73 13.4 12.73H4.57476C4.2194 12.7301 3.87862 12.8713 3.62738 13.1226L2.15204 14.598C2.08551 14.6645 2.00076 14.7098 1.90849 14.7281C1.81622 14.7465 1.72058 14.7371 1.63367 14.7011C1.54675 14.6651 1.47246 14.6041 1.42019 14.5259C1.36792 14.4477 1.34001 14.3557 1.34 14.2616V3.35C1.34 2.99461 1.48118 2.65378 1.73248 2.40248C1.98378 2.15118 2.32461 2.01 2.68 2.01H13.4C13.7554 2.01 14.0962 2.15118 14.3475 2.40248C14.5988 2.65378 14.74 2.99461 14.74 3.35V11.39Z"
        fill={body}
        stroke={body}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M8.04 7.37H8.0467" stroke={accent} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10.72 7.37H10.7267" stroke={accent} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5.36 7.37H5.3667" stroke={accent} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CreditCardFilledIcon({ size = 16, color, accentColor }: QuickActionIconProps) {
  const { body, accent } = useIconColors(color, accentColor);
  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX} fill="none">
      <Path
        d="M13.4 3.35H2.68C1.93994 3.35 1.34 3.94994 1.34 4.69V11.39C1.34 12.1301 1.93994 12.73 2.68 12.73H13.4C14.1401 12.73 14.74 12.1301 14.74 11.39V4.69C14.74 3.94994 14.1401 3.35 13.4 3.35Z"
        fill={body}
        stroke={body}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M1.34 6.7H14.74" stroke={accent} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function TriangleAlertFilledIcon({ size = 16, color, accentColor }: QuickActionIconProps) {
  const { body, accent } = useIconColors(color, accentColor);
  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX} fill="none">
      <Path
        d="M14.5591 12.06L9.1991 2.68C9.08223 2.47378 8.91274 2.30225 8.70794 2.18291C8.50313 2.06357 8.27034 2.00069 8.0333 2.00069C7.79626 2.00069 7.56347 2.06357 7.35866 2.18291C7.15386 2.30225 6.98437 2.47378 6.8675 2.68L1.5075 12.06C1.38937 12.2646 1.32742 12.4968 1.32795 12.733C1.32847 12.9693 1.39144 13.2012 1.51048 13.4052C1.62952 13.6093 1.80039 13.7783 2.00578 13.895C2.21116 14.0118 2.44376 14.0721 2.68 14.07H13.4C13.6351 14.0698 13.866 14.0077 14.0695 13.89C14.273 13.7723 14.442 13.6031 14.5594 13.3994C14.6769 13.1957 14.7387 12.9648 14.7386 12.7297C14.7386 12.4946 14.6767 12.2636 14.5591 12.06Z"
        fill={body}
        stroke={body}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M8.04 6.03V8.71" stroke={accent} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8.04 11.39H8.0467" stroke={accent} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
