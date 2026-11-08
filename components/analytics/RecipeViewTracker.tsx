"use client";

import { useEffect, useRef } from "react";
import { sendGAEvent } from "@next/third-parties/google";

export function RecipeViewTracker({ slug, enabled }: { slug: string; enabled: boolean }) {
  const lastSentSlug = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || lastSentSlug.current === slug) return;
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!gaId) return;
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const layer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
      const configured = Array.isArray(layer) && layer.some((entry) => {
        const args = Array.from(entry as ArrayLike<unknown>);
        return args[0] === "config" && args[1] === gaId;
      });
      if (configured && lastSentSlug.current !== slug) {
        lastSentSlug.current = slug;
        sendGAEvent("event", "view_recipe", { recipe_slug: slug });
        window.clearInterval(timer);
      } else if (attempts >= 150) {
        window.clearInterval(timer);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [slug, enabled]);

  return null;
}
