/**
 * Fire a Google Analytics 4 event — safe to call even if GA hasn't loaded.
 * Only fires if the user has accepted analytics cookies.
 */
export function trackEvent(
  event: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("cookie-consent") !== "accepted") return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (w.gtag) w.gtag("event", event, params ?? {});
}
