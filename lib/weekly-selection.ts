import type { WeeklyMenu } from "./weekly-content";

export type WeeklyMenuSummary = Omit<WeeklyMenu, "body">;

export function vietnamWeekStart(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - weekday);
  return date.toISOString().slice(0, 10);
}

export function selectFeaturedMenu<T extends Pick<WeeklyMenuSummary, "weekStart">>(menus: T[], now: Date): T | null {
  if (!menus.length) return null;
  const currentStart = Date.parse(vietnamWeekStart(now) + "T00:00:00Z");
  return [...menus].sort((a, b) => {
    const aStart = Date.parse(a.weekStart + "T00:00:00Z");
    const bStart = Date.parse(b.weekStart + "T00:00:00Z");
    const distance = Math.abs(aStart - currentStart) - Math.abs(bStart - currentStart);
    return distance || aStart - bStart;
  })[0];
}
