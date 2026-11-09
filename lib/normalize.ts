/**
 * Normalize Vietnamese text for accent-insensitive, case-insensitive search.
 * NFD → strip diacritics → đ/Đ → d → lowercase → collapse whitespace → trim.
 *
 * Examples:
 *   normalizeSearch("Đậu hũ sốt cà") → "dau hu sot ca"
 *   normalizeSearch("THIT KHO")       → "thit kho"
 */
export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLocaleLowerCase("vi")
    .replace(/\s+/g, " ")
    .trim();
}
