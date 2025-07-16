/**
 * Web Vitals measurement utilities
 * Optimized for Core Web Vitals monitoring
 */

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
}

// Thresholds based on Google's Core Web Vitals
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(
  value: number,
  thresholds: { good: number; poor: number },
): "good" | "needs-improvement" | "poor" {
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
}

export function measureLCP(callback: (metric: WebVitalsMetric) => void) {
  if ("PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      const value = lastEntry.startTime;

      callback({
        name: "LCP",
        value: Math.round(value),
        rating: getRating(value, THRESHOLDS.LCP),
      });
    });

    observer.observe({ entryTypes: ["largest-contentful-paint"] });
  }
}

export function measureFID(callback: (metric: WebVitalsMetric) => void) {
  if ("PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        const value = entry.processingStart - entry.startTime;

        callback({
          name: "FID",
          value: Math.round(value),
          rating: getRating(value, THRESHOLDS.FID),
        });
      }
    });

    observer.observe({ entryTypes: ["first-input"] });
  }
}

export function measureCLS(callback: (metric: WebVitalsMetric) => void) {
  if ("PerformanceObserver" in window) {
    let clsValue = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }

      callback({
        name: "CLS",
        value: Math.round(clsValue * 1000) / 1000,
        rating: getRating(clsValue, THRESHOLDS.CLS),
      });
    });

    observer.observe({ entryTypes: ["layout-shift"] });
  }
}

export function measureTTFB(callback: (metric: WebVitalsMetric) => void) {
  const navigationEntry = performance.getEntriesByType(
    "navigation",
  )[0] as PerformanceNavigationTiming;

  if (navigationEntry) {
    const value = navigationEntry.responseStart - navigationEntry.requestStart;

    callback({
      name: "TTFB",
      value: Math.round(value),
      rating: getRating(value, THRESHOLDS.TTFB),
    });
  }
}

// Initialize all Web Vitals measurements
export function initWebVitals(callback: (metric: WebVitalsMetric) => void) {
  measureLCP(callback);
  measureFID(callback);
  measureCLS(callback);
  measureTTFB(callback);
}
