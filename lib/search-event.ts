import { sendGAEvent } from "@next/third-parties/google";

/**
 * Send a GA4 `search` event.  Call only on submit (Enter / chip click),
 * never on every keystroke.
 */
export function sendSearchGA(
  searchTerm: string,
  resultsCount: number,
): void {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return;
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    const layer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
    const configured =
      Array.isArray(layer) &&
      layer.some((entry) => {
        const args = Array.from(entry as ArrayLike<unknown>);
        return args[0] === "config" && args[1] === gaId;
      });
    if (configured) {
      sendGAEvent("event", "search", {
        search_term: searchTerm,
        results_count: resultsCount,
      });
      window.clearInterval(timer);
    } else if (attempts >= 150) {
      window.clearInterval(timer);
    }
  }, 100);
}
