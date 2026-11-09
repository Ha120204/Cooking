"use client";

import { useState, type FormEvent } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { CheckCircle2, ImageIcon, Link2, Send } from "lucide-react";
import { submissionSchema } from "@/lib/validation/submissions";
import { IngredientRows, type IngredientDraft } from "./IngredientRows";
import { StepRows, type StepDraft } from "./StepRows";

const blankIngredient = (): IngredientDraft => ({ key: crypto.randomUUID(), name: "", amount: "", unit: "" });
const blankStep = (): StepDraft => ({ key: crypto.randomUUID(), text: "" });

export function RecipeSubmissionForm() {
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

  function updateIngredient(key: string, field: "name" | "amount" | "unit", value: string) {
    setIngredients((current) => current.map((row) => row.key === key ? { ...row, [field]: value } : row));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    setSuccess(false);
    const payload = {
      display_name: name, title, description,
      ingredients: ingredients.map(({ name: ingredientName, amount, unit }) => ({ name: ingredientName, amount, unit })),
      steps: steps.map((step) => step.text),
      image_url: imageUrl, image_credit: imageCredit,
      rights_confirmed: rightsConfirmed, website,
    };
    const valid = submissionSchema.safeParse(payload);
    if (!valid.success) {
      setError("Vui lòng kiểm tra thông tin, các bước nấu và xác nhận quyền chia sẻ.");
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Chưa gửi được công thức.");
    } finally {
      setPending(false);
    }
  }

  const sectionClass = "rounded-bep-lg bg-bep-surface p-5 shadow-bep-card sm:p-7";
  const inputClass = "mt-1 block min-h-12 w-full rounded-bep-md border border-bep-border bg-bep-canvas px-4 text-bep-ink";
  return <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] lg:items-start">
    <div className="space-y-6">
      {success && <div role="status" className="flex items-center gap-2 rounded-bep-md bg-bep-herb-light p-4 font-semibold text-bep-herb-ink"><CheckCircle2 size={20} /> Công thức đã được gửi và đang chờ duyệt</div>}
      <section className={sectionClass}><h2 className="mb-5 border-l-4 border-bep-primary pl-3 text-xl font-semibold">1. Thông tin món ăn</h2><div className="grid gap-5">
        <label className="text-sm font-semibold text-bep-primary-dark">Tên hiển thị người nấu *<input required minLength={2} maxLength={60} value={name} onChange={(event) => setName(event.target.value)} placeholder="VD: Cô Ba Sài Gòn" className={inputClass} /></label>
        <label className="text-sm font-semibold text-bep-primary-dark">Tên công thức *<input required minLength={3} maxLength={150} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="VD: Canh chua cá" className={inputClass} /></label>
        <label className="text-sm font-semibold text-bep-primary-dark">Mô tả ngắn *<textarea required minLength={10} maxLength={1000} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Hương vị, kỷ niệm hoặc dịp phù hợp với món ăn..." className="mt-1 block w-full rounded-bep-md border border-bep-border bg-bep-canvas p-4 text-sm leading-6" /></label>
      </div></section>
      <section className={sectionClass}><h2 className="mb-5 border-l-4 border-bep-primary pl-3 text-xl font-semibold">2. Danh sách nguyên liệu</h2><IngredientRows rows={ingredients} onChange={updateIngredient} onAdd={() => setIngredients((current) => [...current, blankIngredient()])} onRemove={(key) => setIngredients((current) => current.filter((row) => row.key !== key))} /></section>
      <section className={sectionClass}><h2 className="mb-5 border-l-4 border-bep-primary pl-3 text-xl font-semibold">3. Các bước thực hiện</h2><StepRows rows={steps} onChange={(key, value) => setSteps((current) => current.map((row) => row.key === key ? { ...row, text: value } : row))} onAdd={() => setSteps((current) => [...current, blankStep()])} onRemove={(key) => setSteps((current) => current.filter((row) => row.key !== key))} /></section>
      <section className={sectionClass}><h2 className="mb-2 flex items-center gap-2 text-xl font-semibold"><ImageIcon className="text-bep-primary-dark" size={22} /> 4. Hình ảnh minh họa</h2><p className="mb-5 text-sm text-bep-smoke">Dán đường dẫn công khai nếu có. Không tải tệp trực tiếp.</p><div className="grid gap-5">
        <label className="text-sm font-semibold text-bep-primary-dark">Đường dẫn ảnh nguồn (URL)<span className="relative mt-1 block"><Link2 size={19} className="absolute left-4 top-4 text-bep-primary-dark" /><input type="url" maxLength={2048} value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://..." className="min-h-12 w-full rounded-bep-md border border-bep-border bg-bep-canvas pl-11 pr-4" /></span></label>
        <label className="text-sm font-semibold text-bep-primary-dark">Nguồn ảnh / Người chụp<input maxLength={200} value={imageCredit} onChange={(event) => setImageCredit(event.target.value)} placeholder="VD: Ảnh tự chụp bởi Mẹ Bắp" className={inputClass} /></label>
        <div className="flex items-center gap-4 rounded-bep-md bg-bep-dim p-4"><span className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-bep-md bg-bep-surface text-bep-primary-dark">{imageUrl.startsWith("https://") ? <img src={imageUrl} alt="Xem trước ảnh món" className="size-full object-cover" /> : <ImageIcon size={28} />}</span><div><strong className="text-sm">Khung xem trước ảnh món</strong><p className="mt-1 text-xs leading-5 text-bep-smoke">Ảnh sẽ được kiểm tra quyền sử dụng trước khi đăng.</p></div></div>
      </div></section>
      <section className={sectionClass}><label className="flex min-h-11 items-start gap-3 text-sm leading-6"><input type="checkbox" required checked={rightsConfirmed} onChange={(event) => setRightsConfirmed(event.target.checked)} className="mt-1 size-6 shrink-0 accent-bep-primary" /><span><strong>Tôi có quyền chia sẻ nội dung và hình ảnh này *</strong><br />Nội dung không sao chép trái phép và phù hợp với cộng đồng.</span></label>
        <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="submission-website">Website</label><input id="submission-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
        {error && <p role="alert" className="mt-4 rounded-bep-md bg-bep-primary-light p-3 text-sm text-bep-error-text">{error}</p>}
        <button type="submit" disabled={pending} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-bep-md bg-bep-primary px-6 font-semibold text-white hover:bg-bep-primary-dark disabled:opacity-60"><Send size={18} /> {pending ? "Đang gửi..." : "Gửi công thức lên bếp"}</button><p className="mt-2 text-xs text-bep-smoke">Miễn phí và phi thương mại. Công thức sẽ được xem xét trước khi đăng.</p>
      </section>
    </div>
    <aside className="space-y-5 lg:sticky lg:top-24"><div className="rounded-bep-lg bg-bep-primary-light p-6"><h2 className="text-lg font-semibold text-bep-primary-dark">Lời ngỏ từ Bếp</h2><p className="mt-3 text-sm leading-7 text-bep-smoke">Mỗi công thức là một câu chuyện. Hãy kể rõ nguyên liệu, từng bước nấu và nguồn ảnh để mọi người có thể thử món của bạn.</p></div><div className="rounded-bep-lg border border-bep-border bg-bep-surface p-6"><h2 className="font-semibold">Trước khi gửi</h2><ol className="mt-3 list-inside list-decimal space-y-2 text-sm leading-6 text-bep-smoke"><li>Kiểm tra lượng nguyên liệu.</li><li>Viết các bước theo đúng thứ tự.</li><li>Chỉ chia sẻ ảnh và nội dung bạn có quyền sử dụng.</li></ol></div></aside>
  </form>;
}
