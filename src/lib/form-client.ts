export function getFormSessionId() {
  const key = "cta-form-session";
  let value = sessionStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    sessionStorage.setItem(key, value);
  }
  return value;
}

declare global {
  interface Window { ctaLeadAttribution?: Record<string, string> }
}
export function getLeadAttribution() {
  return window.ctaLeadAttribution || {};
}
