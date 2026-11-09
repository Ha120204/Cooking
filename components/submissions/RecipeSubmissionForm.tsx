"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { CheckCircle2, ImageIcon, Link2, Send } from "lucide-react";
import { submissionSchema } from "@/lib/validation/submissions";
import { IngredientRows, type IngredientDraft } from "./IngredientRows";
import { StepRows, type StepDraft } from "./StepRows";
import { FieldError } from "@/components/forms/FieldError";
import { fieldErrorsFromZod, focusFirstError, type FieldErrors } from "@/lib/validation/form-fields";

const blankIngredient = (): IngredientDraft => ({ key: crypto.randomUUID(), name: "", amount: "", unit: "" });
const blankStep = (): StepDraft => ({ key: crypto.randomUUID(), text: "" });

export function RecipeSubmissionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<IngredientDraft[]>([{ key: "first-ingredient", name: "", amount: "", unit: "" }]);
  const [steps, setSteps] = useState<StepDraft[]>([{ key: "first-step", text: "" }]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageCredit, setImageCredit] = useState("");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [previewState, setPreviewState] = useState<"empty" | "loading" | "ready" | "error">("empty");

  useEffect(() => { setPreviewState(imageUrl.startsWith("https://") ? "loading" : "empty"); }, [imageUrl]);

  function clearField(field: string) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function updateIngredient(key: string, field: "name" | "amount" | "unit", value: string) {
    const index = ingredients.findIndex((row) => row.key === key);
    clearField(`ingredients.${index}.${field}`);
    setIngredients((current) => current.map((row) => row.key === key ? { ...row, [field]: value } : row));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    setSuccess(false);
    setFieldErrors({});
    const payload = {
      display_name: name, title, description,
      ingredients: ingredients.map(({ name: ingredientName, amount, unit }) => ({ name: ingredientName, amount, unit })),
      steps: steps.map((step) => step.text),
      image_url: imageUrl, image_credit: imageCredit,
      rights_confirmed: rightsConfirmed, website,
    };
    const valid = submissionSchema.safeParse(payload);
    if (!valid.success) {
      const errors = fieldErrorsFromZod(valid.error, {
        display_name: "Tên hiển thị cần từ 2 đến 60 ký tự.",
        title: "Tên công thức cần từ 3 đến 150 ký tự.",
        description: "Mô tả cần từ 10 đến 1000 ký tự.",
        ingredients: "Kiểm tra tên và số lượng nguyên liệu.",
        steps: "Mỗi bước cần từ 10 đến 1000 ký tự; tổng nội dung tối đa 10000 ký tự.",
        image_url: "Dùng đường dẫn HTTPS hợp lệ hoặc để trống.",
        image_credit: "Nguồn ảnh tối đa 200 ký tự.",
        rights_confirmed: "Vui lòng xác nhận quyền chia sẻ trước khi gửi.",
      });
      setFieldErrors(errors);
      focusFirstError(formRef.current, errors);
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/recipe-submissions", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(valid.data),
      });
      const data = await response.json() as { id?: string; status?: string; error?: string };
      if (!response.ok || data.status !== "pending") throw new Error(data.error ?? "Chưa gửi được công thức.");
      sendGAEvent("event", "submit_recipe", { submission_status: "pending" });
      setSuccess(true);
      setName(""); setTitle(""); setDescription("");
      setIngredients([{ key: "first-ingredient", name: "", amount: "", unit: "" }]);
      setSteps([{ key: "first-step", text: "" }]);
      setImageUrl(""); setImageCredit(""); setRightsConfirmed(false);
      setFieldErrors({});
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Chưa gửi được công thức.");
    } finally {
      setPending(false);
    }
  }

  const sectionClass = "rounded-bep-lg bg-bep-surface p-5 shadow-bep-card sm:p-7";
  const inputClass = "bep-field mt-1 block min-h-12 w-full rounded-bep-md border border-bep-border bg-bep-canvas px-4 text-bep-ink";
  return <form ref={formRef} noValidate onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] lg:items-start">
    <div className="space-y-6">
      {success && <div role="status" className="flex items-center gap-2 rounded-bep-md bg-bep-herb-light p-4 font-semibold text-bep-herb-ink"><CheckCircle2 size={20} /> Công thức đã được gửi và đang chờ duyệt</div>}
      <section className={sectionClass}><h2 className="mb-5 border-l-4 border-bep-primary pl-3 text-xl font-semibold">1. Thông tin món ăn</h2><div className="grid gap-5">
        <label className="text-sm font-semibold text-bep-primary-dark">Tên hiển thị người nấu *<input data-field="display_name" aria-invalid={!!fieldErrors.display_name} aria-describedby={fieldErrors.display_name ? "submission-name-error" : undefined} required minLength={2} maxLength={60} value={name} onChange={(event) => { setName(event.target.value); clearField("display_name"); }} placeholder="VD: Cô Ba Sài Gòn" className={inputClass} /><FieldError id="submission-name-error" message={fieldErrors.display_name} /></label>
        <label className="text-sm font-semibold text-bep-primary-dark">Tên công thức *<input data-field="title" aria-invalid={!!fieldErrors.title} aria-describedby={fieldErrors.title ? "submission-title-error" : undefined} required minLength={3} maxLength={150} value={title} onChange={(event) => { setTitle(event.target.value); clearField("title"); }} placeholder="VD: Canh chua cá" className={inputClass} /><FieldError id="submission-title-error" message={fieldErrors.title} /></label>
        <label className="text-sm font-semibold text-bep-primary-dark">Mô tả ngắn *<textarea data-field="description" aria-invalid={!!fieldErrors.description} aria-describedby={fieldErrors.description ? "submission-description-error" : undefined} required minLength={10} maxLength={1000} rows={3} value={description} onChange={(event) => { setDescription(event.target.value); clearField("description"); }} placeholder="Hương vị, kỷ niệm hoặc dịp phù hợp với món ăn..." className="bep-field mt-1 block w-full rounded-bep-md border border-bep-border bg-bep-canvas p-4 text-sm leading-6" /><FieldError id="submission-description-error" message={fieldErrors.description} /></label>
      </div></section>
      <section className={sectionClass}><h2 className="mb-5 border-l-4 border-bep-primary pl-3 text-xl font-semibold">2. Danh sách nguyên liệu</h2><IngredientRows rows={ingredients} errors={fieldErrors} onChange={updateIngredient} onAdd={() => setIngredients((current) => [...current, blankIngredient()])} onRemove={(key) => { setIngredients((current) => current.filter((row) => row.key !== key)); setFieldErrors({}); }} /></section>
      <section className={sectionClass}><h2 className="mb-5 border-l-4 border-bep-primary pl-3 text-xl font-semibold">3. Các bước thực hiện</h2><StepRows rows={steps} errors={fieldErrors} onChange={(key, value) => { const index = steps.findIndex((row) => row.key === key); clearField(`steps.${index}`); clearField("steps"); setSteps((current) => current.map((row) => row.key === key ? { ...row, text: value } : row)); }} onAdd={() => setSteps((current) => [...current, blankStep()])} onRemove={(key) => { setSteps((current) => current.filter((row) => row.key !== key)); setFieldErrors({}); }} /></section>
      <section className={sectionClass}><h2 className="mb-2 flex items-center gap-2 text-xl font-semibold"><ImageIcon className="text-bep-primary-dark" size={22} /> 4. Hình ảnh minh họa</h2><p className="mb-5 text-sm text-bep-smoke">Dán đường dẫn công khai nếu có. Không tải tệp trực tiếp.</p><div className="grid gap-5">
        <label className="text-sm font-semibold text-bep-primary-dark">Đường dẫn ảnh nguồn (URL)<span className="relative mt-1 block"><Link2 size={19} className="absolute left-4 top-4 text-bep-primary-dark" /><input data-field="image_url" aria-invalid={!!fieldErrors.image_url} aria-describedby={fieldErrors.image_url ? "submission-image-url-error" : undefined} type="url" maxLength={2048} value={imageUrl} onChange={(event) => { setImageUrl(event.target.value); clearField("image_url"); }} placeholder="https://..." className="bep-field min-h-12 w-full rounded-bep-md border border-bep-border bg-bep-canvas pl-11 pr-4" /></span><FieldError id="submission-image-url-error" message={fieldErrors.image_url} /></label>
        <label className="text-sm font-semibold text-bep-primary-dark">Nguồn ảnh / Người chụp<input data-field="image_credit" aria-invalid={!!fieldErrors.image_credit} aria-describedby={fieldErrors.image_credit ? "submission-image-credit-error" : undefined} maxLength={200} value={imageCredit} onChange={(event) => { setImageCredit(event.target.value); clearField("image_credit"); }} placeholder="VD: Ảnh tự chụp bởi Mẹ Bắp" className={inputClass} /><FieldError id="submission-image-credit-error" message={fieldErrors.image_credit} /></label>
        <div className="flex items-center gap-4 rounded-bep-md bg-bep-dim p-4"><span className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-bep-md bg-bep-surface text-bep-primary-dark">{imageUrl.startsWith("https://") && previewState !== "error" && <img src={imageUrl} alt="Xem trước ảnh món" onLoad={() => setPreviewState("ready")} onError={() => setPreviewState("error")} className={previewState === "ready" ? "size-full object-cover" : "hidden"} />}{previewState === "loading" ? <span role="status" aria-label="Đang tải ảnh xem trước" className="size-full animate-pulse bg-bep-border" /> : previewState === "error" || previewState === "empty" ? <ImageIcon size={28} /> : null}</span><div><strong className="text-sm">Khung xem trước ảnh món</strong><p className="mt-1 text-xs leading-5 text-bep-smoke">{previewState === "error" ? "Không tải được ảnh. Hãy kiểm tra đường dẫn hoặc dùng ảnh khác." : "Ảnh sẽ được kiểm tra quyền sử dụng trước khi đăng."}</p></div></div>
      </div></section>
      <section className={sectionClass}><label className={"flex min-h-11 items-start gap-3 rounded-bep-md border p-2 text-sm leading-6 " + (fieldErrors.rights_confirmed ? "border-bep-error-border" : "border-transparent")}><input data-field="rights_confirmed" aria-invalid={!!fieldErrors.rights_confirmed} aria-describedby={fieldErrors.rights_confirmed ? "submission-rights-error" : undefined} type="checkbox" required checked={rightsConfirmed} onChange={(event) => { setRightsConfirmed(event.target.checked); clearField("rights_confirmed"); }} className="mt-1 size-6 shrink-0 accent-bep-primary" /><span><strong>Tôi có quyền chia sẻ nội dung và hình ảnh này *</strong><br />Nội dung không sao chép trái phép và phù hợp với cộng đồng.</span></label><FieldError id="submission-rights-error" message={fieldErrors.rights_confirmed} />
        <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="submission-website">Website</label><input id="submission-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
        {error && <p role="alert" className="mt-4 rounded-bep-md bg-bep-primary-light p-3 text-sm text-bep-error-text">{error}</p>}
        <button type="submit" disabled={pending} aria-busy={pending} className="bep-action bep-action-primary mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-bep-md bg-bep-primary px-6 font-semibold text-white"><Send size={18} /> {pending ? "Đang gửi..." : "Gửi công thức lên bếp"}</button><p className="mt-2 text-xs text-bep-smoke">Miễn phí và phi thương mại. Công thức sẽ được xem xét trước khi đăng.</p>
      </section>
    </div>
    <aside className="space-y-5 lg:sticky lg:top-24"><div className="rounded-bep-lg bg-bep-primary-light p-6"><h2 className="text-lg font-semibold text-bep-primary-dark">Lời ngỏ từ Bếp</h2><p className="mt-3 text-sm leading-7 text-bep-smoke">Mỗi công thức là một câu chuyện. Hãy kể rõ nguyên liệu, từng bước nấu và nguồn ảnh để mọi người có thể thử món của bạn.</p></div><div className="rounded-bep-lg border border-bep-border bg-bep-surface p-6"><h2 className="font-semibold">Trước khi gửi</h2><ol className="mt-3 list-inside list-decimal space-y-2 text-sm leading-6 text-bep-smoke"><li>Kiểm tra lượng nguyên liệu.</li><li>Viết các bước theo đúng thứ tự.</li><li>Chỉ chia sẻ ảnh và nội dung bạn có quyền sử dụng.</li></ol></div></aside>
  </form>;
}
