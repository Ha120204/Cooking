/**
 * Scroll to a target element, respecting prefers-reduced-motion.
 * After scrolling, optionally focus the element (tabIndex={-1} heading)
 * so screen readers announce it.
 */
export function scrollToResults(
  element: HTMLElement | null,
  options?: { focus?: boolean },
): void {
  if (!element) return;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  element.scrollIntoView({
    behavior: prefersReduced ? "instant" : "smooth",
    block: "start",
  });
  if (options?.focus !== false) {
    window.requestAnimationFrame(() => {
      element.focus({ preventScroll: true });
    });
  }
}

/**
 * Check whether an element is already visible in the viewport
 * below the sticky header (plus 16px buffer).
 */
export function isInViewport(element: HTMLElement): boolean {
  const headerHeight = typeof window !== "undefined" && window.innerWidth >= 1024 ? 80 : 64;
  const rect = element.getBoundingClientRect();
  return rect.top >= headerHeight + 16 && rect.bottom <= window.innerHeight;
}
