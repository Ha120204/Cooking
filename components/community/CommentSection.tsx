"use client";

import { useEffect, useState, type FormEvent } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import type { CommentTarget, PublicComment } from "@/lib/supabase/types";

export function CommentSection({ targetType, slug, intro }: { targetType: CommentTarget; slug: string; intro?: string }) {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/comments?target_type=${targetType}&target_slug=${encodeURIComponent(slug)}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Chưa tải được bình luận.");
        return response.json() as Promise<{ comments: PublicComment[] }>;
      })
      .then((result) => { setComments(result.comments); setError(""); })
      .catch((reason: unknown) => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Chưa tải được bình luận."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [targetType, slug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/comments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: targetType, target_slug: slug, display_name: name, body, website }),
      });
      const result = await response.json() as { comment?: PublicComment; error?: string };
      if (!response.ok || !result.comment) throw new Error(result.error ?? "Chưa gửi được bình luận.");
      setComments((current) => [result.comment!, ...current]);
      setBody("");
      sendGAEvent("event", "post_comment", { target_type: targetType, target_slug: slug });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Chưa gửi được bình luận.");
    } finally {
      setSending(false);
    }
  }

  return <div>
    {intro && <p className="mt-3 text-base font-medium text-bep-smoke">{intro}</p>}
    <div aria-live="polite" className="mt-4 space-y-3">
      {loading ? <p className="rounded-bep-md bg-bep-dim p-4 text-sm text-bep-smoke">Đang tải bình luận...</p>
        : comments.length ? comments.map((comment) => <article key={comment.id} className="rounded-bep-md border border-bep-border bg-bep-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-bep-ink">{comment.display_name}</strong><time dateTime={comment.created_at} className="text-xs text-bep-smoke">{new Date(comment.created_at).toLocaleDateString("vi-VN")}</time></div>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-bep-smoke">{comment.body}</p>
        </article>)
          : <p className="rounded-bep-md bg-bep-dim p-4 text-sm text-bep-smoke">Chưa có bình luận. Hãy chia sẻ lời đầu tiên nhé.</p>}
    </div>
    <form onSubmit={submit} className="mt-5 grid gap-3">
      <label htmlFor={`${targetType}-${slug}-name`} className="text-sm font-semibold">Tên hiển thị</label>
      <input id={`${targetType}-${slug}-name`} value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={60} placeholder="Tên của bạn" className="bep-field min-h-11 rounded-bep-md border border-bep-border bg-bep-dim px-4" />
      <label htmlFor={`${targetType}-${slug}-body`} className="text-sm font-semibold">Lời chia sẻ</label>
      <textarea id={`${targetType}-${slug}-body`} value={body} onChange={(event) => setBody(event.target.value)} required minLength={2} maxLength={2000} rows={4} placeholder="Bạn đã nấu món này thế nào?" className="bep-field rounded-bep-md border border-bep-border bg-bep-dim p-4" />
      <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor={`${targetType}-${slug}-website`}>Website</label><input id={`${targetType}-${slug}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
      {error && <p role="alert" className="text-sm text-[#B42318]">{error}</p>}
      <button type="submit" disabled={sending} aria-busy={sending} className="bep-action bep-action-primary min-h-11 w-fit rounded-bep-md bg-bep-primary px-5 font-semibold text-white">{sending ? "Đang gửi..." : "Gửi bình luận"}</button>
    </form>
  </div>;
}
