// Empty, missing and invalid provider values must never become a price or score of zero.
export function toNullableNumber(value) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

// Trading thresholds and quoted asset prices must be finite and positive.
export function toPositiveNumber(value) {
  const number = toNullableNumber(value);
  return number !== null && number > 0 ? number : null;
}
