"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function useChartColors() {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    const getColor = (varName: string) => {
      const value = computedStyle.getPropertyValue(varName).trim();
      // If it's HSL values, wrap in hsl()
      if (value && !value.startsWith("#") && !value.startsWith("rgb") && !value.startsWith("hsl")) {
        return `hsl(${value})`;
      }
      return value;
    };

    setColors({
      primary: getColor("--primary"),
      secondary: getColor("--secondary"),
      accent: getColor("--accent"),
      destructive: getColor("--destructive"),
      success: getColor("--success"),
      warning: getColor("--warning"),
      muted: getColor("--muted"),
      border: getColor("--border"),
      chart1: getColor("--chart-1"),
      chart2: getColor("--chart-2"),
      chart3: getColor("--chart-3"),
      chart4: getColor("--chart-4"),
      chart5: getColor("--chart-5"),
      foreground: getColor("--foreground"),
      mutedForeground: getColor("--muted-foreground"),
    });
  }, [resolvedTheme]);

  return colors;
}
