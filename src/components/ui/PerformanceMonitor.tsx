import { useEffect, useState } from "react";

interface PerformanceMetrics {
  fps: number;
  cls: number;
  lcp: number;
  fid: number;
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    cls: 0,
    lcp: 0,
    fid: 0,
  });
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    // Only show in development
    if (import.meta.env.DEV) {
      setShowMonitor(true);
    }

    // FPS monitoring
    let frames = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      if (currentTime >= lastTime + 1000) {
        setMetrics((prev) => ({
          ...prev,
          fps: Math.round((frames * 1000) / (currentTime - lastTime)),
        }));
        frames = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);

    // Web Vitals monitoring
    if ("PerformanceObserver" in window) {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        setMetrics((prev) => ({
          ...prev,
          lcp: Math.round(lastEntry.startTime),
        }));
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        setMetrics((prev) => ({
          ...prev,
          cls: Math.round(clsValue * 1000) / 1000,
        }));
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          setMetrics((prev) => ({
            ...prev,
            fid: Math.round(entry.processingStart - entry.startTime),
          }));
        }
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
    }
  }, []);

  if (!showMonitor) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50 backdrop-blur-sm">
      <div className="space-y-1">
        <div
          className={`flex justify-between gap-4 ${metrics.fps >= 55 ? "text-green-400" : metrics.fps >= 30 ? "text-yellow-400" : "text-red-400"}`}
        >
          <span>FPS:</span>
          <span>{metrics.fps}</span>
        </div>
        <div
          className={`flex justify-between gap-4 ${metrics.cls <= 0.05 ? "text-green-400" : metrics.cls <= 0.25 ? "text-yellow-400" : "text-red-400"}`}
        >
          <span>CLS:</span>
          <span>{metrics.cls}</span>
        </div>
        <div
          className={`flex justify-between gap-4 ${metrics.lcp <= 2500 ? "text-green-400" : metrics.lcp <= 4000 ? "text-yellow-400" : "text-red-400"}`}
        >
          <span>LCP:</span>
          <span>{metrics.lcp}ms</span>
        </div>
        <div
          className={`flex justify-between gap-4 ${metrics.fid <= 100 ? "text-green-400" : metrics.fid <= 300 ? "text-yellow-400" : "text-red-400"}`}
        >
          <span>FID:</span>
          <span>{metrics.fid}ms</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
