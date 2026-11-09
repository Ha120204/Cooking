"use client";

import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";

type ShareButtonProps = { slug: string; title: string; description: string };

export function ShareButton({ slug, title, description }: ShareButtonProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [message]);

  async function share() {
    if (pending) return;
    setPending(true);
    setMessage("");
    const url = new URL(`/cong-thuc/${slug}`, window.location.origin).href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: description, url });
        sendGAEvent("event", "share", { method: "native", recipe_slug: slug });
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("Đã sao chép liên kết");
        sendGAEvent("event", "share", { method: "copy_link", recipe_slug: slug });
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setMessage("Chưa chia sẻ được liên kết. Vui lòng thử lại.");
      }
    } finally {
      setPending(false);
    }
  }

  return <span className="relative inline-flex items-center">
    <button type="button" onClick={share} disabled={pending} aria-busy={pending} className="bep-action bep-action-muted inline-flex min-h-11 items-center gap-2 rounded-bep-md bg-bep-dim px-4 text-sm font-semibold text-bep-primary-dark"><Share2 size={18} /> {pending ? "Đang chia sẻ..." : "Chia sẻ"}</button>
    {message && <span role="status" className="absolute bottom-full left-0 z-10 mb-2 w-max max-w-60 rounded-bep-md bg-bep-ink px-3 py-2 text-sm text-white shadow-bep-card">{message}</span>}
  </span>;
}
