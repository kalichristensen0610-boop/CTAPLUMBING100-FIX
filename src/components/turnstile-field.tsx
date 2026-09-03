"use client";

import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export function TurnstileField({ onToken, resetSignal = 0 }: { onToken: (token: string) => void; resetSignal?: number }) {
  const id = useId().replace(/:/g, "");
  const container = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !container.current) return;
    let widgetId = "";
    let cancelled = false;
    const timer = window.setInterval(() => {
      if (cancelled || widgetId || !window.turnstile || !container.current) return;
      widgetId = window.turnstile.render(container.current, {
        sitekey: siteKey,
        appearance: "interaction-only",
        size: "flexible",
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
      window.clearInterval(timer);
    }, 100);
    return () => { cancelled = true; window.clearInterval(timer); if (widgetId) window.turnstile?.remove(widgetId); };
  }, [id, onToken, resetSignal, siteKey]);

  if (!siteKey) return null;
  return <div id={`turnstile-${id}`} ref={container} className="mt-5 min-h-1" aria-label="Security verification" />;
}
