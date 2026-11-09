"use client";

import { useEffect, useState } from "react";

const currentYear = () => Number(new Intl.DateTimeFormat("vi-VN", { year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()));

export function CurrentYear() {
  const [year, setYear] = useState(currentYear);
  useEffect(() => {
    const timer = window.setInterval(() => setYear(currentYear()), 60 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <span suppressHydrationWarning>{year}</span>;
}
