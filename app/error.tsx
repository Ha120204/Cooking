"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center"><h1 className="text-2xl font-bold text-bep-ink">Bếp đang gặp trục trặc</h1><p className="mt-3 text-bep-smoke">Chưa thể tải công thức lúc này. Bạn thử lại sau một chút nhé.</p><button type="button" onClick={reset} className="mt-6 min-h-11 rounded-bep-md bg-bep-primary px-6 font-semibold text-white">Thử lại</button></main>;
}
