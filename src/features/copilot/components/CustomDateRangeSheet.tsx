import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, type BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

import { Icon, PressableScale, Text } from "@/components/ui";
import { useAppTheme } from "@/design-system";
import { getTransactionDateBounds } from "@/data/transactions";
import { daysInMonth, firstWeekdayOfMonth, formatMonthYear, todayIsoDate } from "@/lib/date";

export interface CustomDateRangeSheetProps {
  onApply: (startIso: string, endIso: string) => void;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const CELL_WIDTH = `${100 / 7}%`;

function renderBackdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Custom date-range picker behind the copilot "analyze spending" flow's "Custom" time-range pill
 * (Figma only shows it as a flat chip with no picker behind it — this makes that option actually
 * functional). A `@gorhom/bottom-sheet` modal (ADR-009) with a hand-rolled single-month calendar
 * grid — no new dependency (CLAUDE.md "ask before adding a dependency"). Bounded below by the
 * earliest seed transaction (`getTransactionDateBounds`) and above by the device's current date —
 * future dates are never selectable, independent of what the seed data happens to cover. Tap a
 * start day, then an end day, to select a range; tapping again after a full range is selected
 * starts a new one.
 */
export const CustomDateRangeSheet = forwardRef<BottomSheetModal, CustomDateRangeSheetProps>(
  function CustomDateRangeSheet({ onApply }, ref) {
    const { colors } = useAppTheme();
    const sheetRef = useRef<BottomSheetModal>(null);
    useImperativeHandle(ref, () => sheetRef.current as BottomSheetModal);

    const bounds = useMemo(() => getTransactionDateBounds(), []);
    const [minYear, minMonth] = bounds.minDate.split("-").map(Number);
    // Navigable/selectable upper bound is the device's current date, not the seed data's latest
    // transaction — future dates aren't selectable regardless of what the mock data happens to
    // cover.
    const today = useMemo(() => todayIsoDate(), []);
    const [maxYear, maxMonth] = today.split("-").map(Number);

    const [viewYear, setViewYear] = useState(maxYear);
    const [viewMonth, setViewMonth] = useState(maxMonth);
    const [rangeStart, setRangeStart] = useState<string>();
    const [rangeEnd, setRangeEnd] = useState<string>();

    const canGoPrev = viewYear > minYear || (viewYear === minYear && viewMonth > minMonth);
    const canGoNext = viewYear < maxYear || (viewYear === maxYear && viewMonth < maxMonth);

    function goPrevMonth() {
      if (!canGoPrev) return;
      if (viewMonth === 1) {
        setViewYear((year) => year - 1);
        setViewMonth(12);
      } else {
        setViewMonth((month) => month - 1);
      }
    }

    function goNextMonth() {
      if (!canGoNext) return;
      if (viewMonth === 12) {
        setViewYear((year) => year + 1);
        setViewMonth(1);
      } else {
        setViewMonth((month) => month + 1);
      }
    }

    function handleDayPress(iso: string) {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(iso);
        setRangeEnd(undefined);
      } else if (iso < rangeStart) {
        setRangeStart(iso);
      } else {
        setRangeEnd(iso);
      }
    }

    function handleClear() {
      setRangeStart(undefined);
      setRangeEnd(undefined);
    }

    function handleApply() {
      if (!rangeStart) return;
      onApply(rangeStart, rangeEnd ?? rangeStart);
      sheetRef.current?.dismiss();
    }

    const totalDays = daysInMonth(viewYear, viewMonth);
    const leadingBlanks = firstWeekdayOfMonth(viewYear, viewMonth);
    const cells: (string | null)[] = [
      ...Array.from({ length: leadingBlanks }, () => null),
      ...Array.from({ length: totalDays }, (_, index) => `${viewYear}-${pad(viewMonth)}-${pad(index + 1)}`),
    ];
    // Chunked into explicit week-rows rather than a single `flexWrap` container — `flexWrap`
    // grids mis-measure on native when nested inside `BottomSheetView` (its animated host resolves
    // width too late for Yoga's wrap pass, so only the first row ever laid out — reproduced on the
    // iOS Simulator, not caught by web-only testing). Fixed-row chunking is the standard
    // React Native workaround for this class of bug.
    const weeks: (string | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={["65%"]}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
        onDismiss={handleClear}
      >
        <BottomSheetView className="flex-1 px-5" style={{ gap: 16 }}>
          <View className="flex-row items-start justify-between">
            <Text variant="heading" className="font-sans-semibold">
              Select custom range
            </Text>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={() => sheetRef.current?.dismiss()}
              style={{ width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceMuted }}
            >
              <Icon icon={X} size={18} color="primary" />
            </PressableScale>
          </View>

          <View className="flex-row items-center justify-between">
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Previous month"
              onPress={goPrevMonth}
              style={{ opacity: canGoPrev ? 1 : 0.3, padding: 8 }}
            >
              <Icon icon={ChevronLeft} size={20} color="primary" />
            </PressableScale>
            <Text variant="body" className="font-sans-semibold">
              {formatMonthYear(viewYear, viewMonth)}
            </Text>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Next month"
              onPress={goNextMonth}
              style={{ opacity: canGoNext ? 1 : 0.3, padding: 8 }}
            >
              <Icon icon={ChevronRight} size={20} color="primary" />
            </PressableScale>
          </View>

          <View className="flex-row">
            {WEEKDAY_LABELS.map((label, index) => (
              <View key={index} style={{ width: CELL_WIDTH, alignItems: "center" }}>
                <Text variant="caption" color="muted">
                  {label}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ gap: 4 }}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} className="flex-row">
                {week.map((iso, dayIndex) => {
                  if (!iso) {
                    return <View key={`blank-${weekIndex}-${dayIndex}`} style={{ width: CELL_WIDTH, aspectRatio: 1 }} />;
                  }
                  const isEdge = iso === rangeStart || iso === rangeEnd;
                  const isInRange = Boolean(rangeStart && rangeEnd && iso > rangeStart && iso < rangeEnd);
                  const isFuture = iso > today;
                  const day = Number(iso.slice(8, 10));
                  return (
                    <View key={iso} style={{ width: CELL_WIDTH, aspectRatio: 1, padding: 2 }}>
                      <PressableScale
                        accessibilityRole="button"
                        accessibilityLabel={iso}
                        accessibilityState={{ selected: isEdge, disabled: isFuture }}
                        disabled={isFuture}
                        onPress={() => handleDayPress(iso)}
                        style={{
                          flex: 1,
                          borderRadius: 999,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isEdge ? colors.accent : isInRange ? colors.accentMuted : "transparent",
                        }}
                      >
                        <Text
                          variant="caption"
                          className="font-sans-medium"
                          style={{
                            color: isEdge ? colors.onAccent : isFuture ? colors.textSecondary : colors.textPrimary,
                            opacity: isFuture ? 0.6 : 1,
                          }}
                        >
                          {day}
                        </Text>
                      </PressableScale>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          <View className="flex-row items-center gap-3">
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Clear selection"
              onPress={handleClear}
              style={{ flex: 1, height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }}
            >
              <Text variant="body" className="font-sans-medium" color="primary">
                Clear
              </Text>
            </PressableScale>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Apply date range"
              disabled={!rangeStart}
              onPress={handleApply}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.navy,
                opacity: rangeStart ? 1 : 0.4,
              }}
            >
              <Text variant="body" className="font-sans-medium" style={{ color: colors.onAccent }}>
                Apply
              </Text>
            </PressableScale>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default CustomDateRangeSheet;
