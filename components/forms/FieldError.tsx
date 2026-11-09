export function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <span id={id} className="mt-1 block text-sm font-medium text-bep-error-text">{message}</span> : null;
}
