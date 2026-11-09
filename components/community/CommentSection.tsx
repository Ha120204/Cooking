"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import type { CommentTarget, PublicComment } from "@/lib/supabase/types";
import { commentSchema } from "@/lib/validation/community";
import { FieldError } from "@/components/forms/FieldError";
import { fieldErrorsFromZod, focusFirstError, type FieldErrors } from "@/lib/validation/form-fields";

export function CommentSection({ targetType, slug, intro }: { targetType: CommentTarget; slug: string; intro?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [attempt, setAttempt] = useState(0);

  function clearField(field: string) { setFieldErrors((current) => ({ ...current, [field]: "" })); }

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError("");
    fetch(`/api/comments?target_type=${targetType}&target_slug=${encodeURIComponent(slug)}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Chưa tải được bình luận.");
        return response.json() as Promise<{ comments: PublicComment[] }>;
      })
      .then((result) => { if (!controller.signal.aborted) { setComments(result.comments); setLoadError(""); } })
      .catch((reason: unknown) => { if (!controller.signal.aborted) setLoadError(reason instanceof Error ? reason.message : "Chưa tải được bình luận."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [targetType, slug, attempt]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setFieldErrors({});
    const input = commentSchema.safeParse({ target_type: targetType, target_slug: slug, display_name: name, body, website });
    if (!input.success) {
      const errors = fieldErrorsFromZod(input.error, {
        display_name: "Tên hiển thị cần từ 2 đến 60 ký tự.",
        body: "Bình luận cần từ 2 đến 2000 ký tự.",
      });
      setFieldErrors(errors);
      focusFirstError(formRef.current, errors);
      return;
    }
    setSending(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/comments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input.data),
      });
      const result = await response.json() as { comment?: PublicComment; error?: string };
      if (!response.ok || !result.comment) throw new Error(result.error ?? "Chưa gửi được bình luận.");
      setComments((current) => [result.comment!, ...current]);
      setBody("");
      sendGAEvent("event", "post_comment", { target_type: targetType, target_slug: slug });
    } catch (reason) {
      setSubmitError(reason instanceof Error ? reason.message : "Chưa gửi được bình luận.");
    } finally {
      setSending(false);
    }
  }

  return <div>
    {intro && <p className="mt-3 text-base font-medium text-bep-smoke">{intro}</p>}
    <div aria-live="polite" className="mt-4 space-y-3">
      {loading ? <div role="status" aria-label="Đang tải bình luận" className="space-y-3">{[1, 2].map((item) => <div key={item} className="h-20 animate-pulse rounded-bep-md bg-bep-dim" />)}</div>
        : loadError ? <div role="alert" className="rounded-bep-md bg-bep-dim p-4 text-sm text-bep-error-text">{loadError}<button type="button" onClick={() => setAttempt((current) => current + 1)} className="bep-action bep-action-muted ml-2 min-h-11 rounded-bep-md px-3 font-semibold">Thử lại</button></div>
        : comments.length ? comments.map((comment) => <article key={comment.id} className="rounded-bep-md border border-bep-border bg-bep-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-bep-ink">{comment.display_name}</strong><time dateTime={comment.created_at} className="text-xs text-bep-smoke">{new Date(comment.created_at).toLocaleDateString("vi-VN")}</time></div>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-bep-smoke">{comment.body}</p>
        </article>)
          : <p className="rounded-bep-md bg-bep-dim p-4 text-sm text-bep-smoke">Chưa có bình luận. Hãy chia sẻ lời đầu tiên nhé.</p>}
    </div>
    <form ref={formRef} noValidate onSubmit={submit} className="mt-5 grid gap-3">
      <label htmlFor={`${targetType}-${slug}-name`} className="text-sm font-semibold">Tên hiển thị</label>
      <input id={`${targetType}-${slug}-name`} data-field="display_name" aria-invalid={!!fieldErrors.display_name} aria-describedby={fieldErrors.display_name ? `${targetType}-${slug}-name-error` : undefined} value={name} onChange={(event) => { setName(event.target.value); clearField("display_name"); }} required minLength={2} maxLength={60} placeholder="Tên của bạn" className="bep-field min-h-11 rounded-bep-md border border-bep-border bg-bep-dim px-4" /><FieldError id={`${targetType}-${slug}-name-error`} message={fieldErrors.display_name} />
      <label htmlFor={`${targetType}-${slug}-body`} className="text-sm font-semibold">Lời chia sẻ</label>
      <textarea id={`${targetType}-${slug}-body`} data-field="body" aria-invalid={!!fieldErrors.body} aria-describedby={fieldErrors.body ? `${targetType}-${slug}-body-error` : undefined} value={body} onChange={(event) => { setBody(event.target.value); clearField("body"); }} required minLength={2} maxLength={2000} rows={4} placeholder="Bạn đã nấu món này thế nào?" className="bep-field rounded-bep-md border border-bep-border bg-bep-dim p-4" /><FieldError id={`${targetType}-${slug}-body-error`} message={fieldErrors.body} />
      <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor={`${targetType}-${slug}-website`}>Website</label><input id={`${targetType}-${slug}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
      {submitError && <p role="alert" className="text-sm text-bep-error-text">{submitError}</p>}
      <button type="submit" disabled={sending} aria-busy={sending} className="bep-action bep-action-primary min-h-11 w-fit rounded-bep-md bg-bep-primary px-5 font-semibold text-white">{sending ? "Đang gửi..." : "Gửi bình luận"}</button>
    </form>
  </div>;
}
