import type { ZodError } from "zod";

export type FieldErrors = Record<string, string>;

export function fieldErrorsFromZod(error: ZodError, messages: Record<string, string>): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".");
    if (field && !errors[field]) errors[field] = messages[field] ?? messages[field.split(".")[0]] ?? "Vui lòng kiểm tra thông tin này.";
  }
  return errors;
}

export function focusFirstError(form: HTMLFormElement | null, errors: FieldErrors) {
  const first = Object.keys(errors)[0];
  if (!first || !form) return;
  window.requestAnimationFrame(() => {
    const field = Array.from(form.querySelectorAll<HTMLElement>("[data-field]"))
      .find((element) => element.dataset.field === first || element.dataset.field?.startsWith(first + "."));
    field?.focus();
  });
}
