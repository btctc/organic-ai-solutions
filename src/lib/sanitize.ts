/** Strip HTML tags, control chars, and trim. Hard cap at maxLength chars. */
export function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"'`]/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .trim()
    .slice(0, maxLength);
}

/** Validate and normalize an email address. Returns "" if invalid. */
export function sanitizeEmail(input: unknown): string {
  if (typeof input !== "string") return "";
  const val = input.trim().toLowerCase().slice(0, 254);
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(val)
    ? val
    : "";
}

/** Keep only characters valid in a phone number. */
export function sanitizePhone(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.replace(/[^0-9\s+\-().ext]/gi, "").trim().slice(0, 30);
}
