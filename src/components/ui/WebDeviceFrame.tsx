import { useCallback, useState, type ReactNode } from "react";
import { Platform, View, useWindowDimensions, type LayoutChangeEvent } from "react-native";

/**
 * Web-only presentation wrapper for the hosted demo.
 *
 * On a phone browser the prototype should feel like the app — full-bleed,
 * edge to edge. On a desktop browser a full-bleed render would stretch a
 * mobile layout across a 1440px window, so the app is instead centred inside
 * a device-sized shell.
 *
 * Native (iOS/Android) always renders children untouched — this component is
 * inert outside the web build.
 */

/** Below this viewport width we assume a phone browser and drop the frame. */
const FRAME_BREAKPOINT = 768;

/** Logical device viewport the prototype was designed against. */
const DEVICE_WIDTH = 390;
const DEVICE_HEIGHT = 844;

/** Breathing room between the shell and the browser window edge. */
const BACKDROP_INSET = 32;

export interface WebDeviceFrameProps {
  children: ReactNode;
}

export function WebDeviceFrame({ children }: WebDeviceFrameProps) {
  const { width } = useWindowDimensions();
  const [backdropHeight, setBackdropHeight] = useState<number | null>(null);

  const onBackdropLayout = useCallback((event: LayoutChangeEvent) => {
    setBackdropHeight(event.nativeEvent.layout.height);
  }, []);

  if (Platform.OS !== "web" || width < FRAME_BREAKPOINT) {
    return <>{children}</>;
  }

  // Sized from the backdrop's measured height rather than the window's, so the
  // shell's bottom edge never falls below the fold. Device metrics are physical
  // dimensions, not design tokens, hence the inline width/height.
  const frameHeight =
    backdropHeight === null
      ? DEVICE_HEIGHT
      : Math.min(DEVICE_HEIGHT, backdropHeight - BACKDROP_INSET * 2);

  return (
    <View
      className="flex-1 items-center justify-center bg-surface-muted"
      onLayout={onBackdropLayout}
    >
      <View
        className="overflow-hidden rounded-2xl border border-border bg-background"
        style={{
          width: DEVICE_WIDTH,
          height: frameHeight,
          // Elevation separates the shell from the backdrop when app and page
          // share a tone (e.g. dark theme). Shadows aren't in the token set.
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.45)",
        }}
      >
        {children}
      </View>
    </View>
  );
}

export default WebDeviceFrame;
