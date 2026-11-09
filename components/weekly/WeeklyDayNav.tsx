"use client";

import { useEffect, useState } from "react";
import type { WeeklyMenu } from "@/lib/weekly-content";

export function WeeklyDayNav({ days }: { days: WeeklyMenu["days"] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const update = () => {
      let current = 0;
      days.forEach((_, index) => {
        if ((document.getElementById(`ngay-${index + 1}`)?.getBoundingClientRect().top ?? Infinity) <= 200) current = index;
      });
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [days]);
  return <nav aria-label="Chọn ngày trong tuần" className="sticky top-16 z-30 -mx-4 mt-6 overflow-x-auto border-y border-bep-border bg-bep-surface/95 px-4 py-2 backdrop-blur-xl sm:mx-0 sm:rounded-bep-md sm:border lg:top-20"><div className="flex min-w-max gap-2">{days.map((day, index) => <a key={day.name} href={"#ngay-" + (index + 1)} aria-current={active === index ? "location" : undefined} className={"bep-chip inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold text-bep-primary-dark " + (active === index ? "border-bep-primary-dark bg-bep-primary-light" : "border-transparent bg-bep-dim")}>{day.name}</a>)}</div></nav>;
}
