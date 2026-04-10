export function trackEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    console.debug("[analytics]", event, data);
  }
}
