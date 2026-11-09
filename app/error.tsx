"use client";

import Link from "next/link";
import { CookingPot } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] items-center justify-center px-4 pb-16 pt-28 text-center sm:px-6 lg:pt-36">
        <div className="w-full max-w-xl rounded-bep-lg border border-bep-border bg-bep-surface px-6 py-10 shadow-bep-card sm:px-10 sm:py-14">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-bep-primary-light text-bep-primary-dark">
            <CookingPot size={40} aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-semibold text-bep-error-text">Bếp cần nghỉ một chút</p>
          <h1 className="mt-3 text-2xl font-bold leading-8 text-bep-ink sm:text-[32px] sm:leading-10">Bếp đang gặp trục trặc</h1>
          <p className="mt-4 text-base leading-7 text-bep-smoke">Trang này chưa tải được. Bạn thử lại, hoặc ghé trang chủ để xem những món khác nhé.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={reset} className="inline-flex min-h-12 items-center justify-center rounded-bep-md bg-bep-primary px-6 font-semibold text-white hover:bg-bep-primary-dark">Thử lại</button>
            <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-bep-md border border-bep-border bg-bep-surface px-6 font-semibold text-bep-primary-dark hover:border-bep-border-hover hover:bg-bep-dim">Về trang chủ</Link>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
