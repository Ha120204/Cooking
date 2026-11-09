import type { WeeklyMenu } from "@/lib/weekly-content";

export function WeeklyDayNav({ days }: { days: WeeklyMenu["days"] }) {
  return <nav aria-label="Chọn ngày trong tuần" className="sticky top-16 z-30 -mx-4 mt-6 overflow-x-auto border-y border-bep-border bg-bep-surface/95 px-4 py-2 backdrop-blur-xl sm:mx-0 sm:rounded-bep-md sm:border lg:top-20"><div className="flex min-w-max gap-2">{days.map((day, index) => <a key={day.name} href={"#ngay-" + (index + 1)} className="inline-flex min-h-11 items-center rounded-full bg-bep-dim px-4 text-sm font-semibold text-bep-primary-dark hover:bg-bep-primary-light">{day.name}</a>)}</div></nav>;
}
