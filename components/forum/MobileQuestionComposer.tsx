"use client";

import { useRef, useState } from "react";
import { QuestionForm } from "./QuestionForm";

export function MobileQuestionComposer() {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  function toggle() {
    if (open) { setOpen(false); return; }
    setOpen(true);
    window.requestAnimationFrame(() => contentRef.current?.querySelector<HTMLInputElement>('[data-field="display_name"]')?.focus());
  }

  return <div className="lg:hidden">
    <button type="button" aria-expanded={open} aria-controls="mobile-question-form" onClick={toggle} className="bep-action bep-action-primary min-h-12 w-full rounded-bep-md bg-bep-primary px-5 font-semibold text-white">{open ? "Đóng form đặt câu hỏi" : "Đặt câu hỏi"}</button>
    {open && <div id="mobile-question-form" ref={contentRef} className="mt-4"><QuestionForm idPrefix="mobile-question" /></div>}
  </div>;
}
