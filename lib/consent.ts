import posthog from "posthog-js";

export const CONSENT_KEY = "s4u_analytics_consent";

export type Consent = "accepted" | "declined";

/** The stored choice, or null if the visitor has not been asked yet. */
export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    // Private mode / storage disabled — treat as "not asked".
    return null;
  }
}

/** Record the choice and apply it to PostHog. */
export function applyConsent(choice: Consent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch { /* storage unavailable — the PostHog opt-in state still applies for this session */ }

  if (choice === "accepted") posthog.opt_in_capturing();
  else posthog.opt_out_capturing();
}
