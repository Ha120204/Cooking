"use client";

import { useEffect, useState } from "react";
import { selectFeaturedMenu, vietnamWeekStart, type WeeklyMenuSummary } from "@/lib/weekly-selection";

export function useFeaturedMenu(menus: WeeklyMenuSummary[]) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 60 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);
  const menu = now ? selectFeaturedMenu(menus, now) : menus[0] ?? null;
  const isCurrent = !!now && !!menu && menu.weekStart === vietnamWeekStart(now);
  return { menu, isCurrent, resolved: now !== null };
}
