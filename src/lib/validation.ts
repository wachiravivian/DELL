// Accepts 0703666999, 0703 666 999, +254703666999, 254703666999 (07xx and 01xx numbers)
export function isValidPhone(value: string) {
  const v = value.replace(/[\s-]/g, "");
  return /^(?:\+?254|0)[17]\d{8}$/.test(v);
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}