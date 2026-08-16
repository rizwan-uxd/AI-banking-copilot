import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useWindowDimensions } from "react-native";

export interface Viewport {
  width: number;
  height: number;
}

const ViewportContext = createContext<Viewport | null>(null);

export interface ViewportProviderProps extends Viewport {
  children: ReactNode;
}

/** Declares the box the app is rendered into, when it isn't the whole window. */
export function ViewportProvider({ width, height, children }: ViewportProviderProps) {
  const value = useMemo<Viewport>(() => ({ width, height }), [width, height]);
  return <ViewportContext.Provider value={value}>{children}</ViewportContext.Provider>;
}

/**
 * The box the app actually occupies — what a screen means by "the screen".
 *
 * Equals the window everywhere except inside `WebDeviceFrame` on web, where
 * the app is centred in a phone-sized shell and the window is the whole
 * desktop browser. Any view that sizes itself to fill the viewport (e.g. a
 * full-bleed background) must read this rather than `useWindowDimensions()`,
 * or it will be drawn at desktop width and crop to a sliver inside the frame.
 *
 * Note `useSafeAreaFrame()` does *not* work for this: on web the safe-area
 * provider reports window metrics regardless of where it sits in the tree.
 */
export function useViewport(): Viewport {
  const window = useWindowDimensions();
  const framed = useContext(ViewportContext);
  return framed ?? { width: window.width, height: window.height };
}
