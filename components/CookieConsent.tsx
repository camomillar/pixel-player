"use client";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { applyConsent, readConsent, type Consent } from "@/lib/consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = readConsent();
    // PostHog starts opted out (see instrumentation-client.ts), so a returning
    // visitor who accepted needs opting back in on each load.
    if (choice === "accepted") posthog.opt_in_capturing();
    else if (choice === null) setVisible(true);
  }, []);

  const decide = (choice: Consent) => {
    applyConsent(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      style={{
        position: "fixed", bottom: 16, left: 16, right: 16, zIndex: 1000,
        maxWidth: 460, margin: "0 auto",
        background: "white", border: "1px solid #e8e8ea", borderRadius: 14,
        boxShadow: "0 6px 28px rgba(0,0,0,0.16)",
        padding: "16px 18px", boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 13, color: "#333", lineHeight: 1.5,
      }}
    >
      <p style={{ margin: "0 0 12px" }}>
        This site uses analytics cookies to understand how it is used. They are only
        set if you accept.{" "}
        <a href="/privacy" style={{ color: "#333", textDecoration: "underline" }}>
          Privacy &amp; cookies
        </a>
      </p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
        <button
          onClick={() => decide("declined")}
          style={{
            fontFamily: "inherit", fontSize: 13, cursor: "pointer",
            padding: "8px 14px", borderRadius: 99,
            border: "1px solid #ddd", background: "white", color: "#555",
          }}
        >
          Decline
        </button>
        <button
          onClick={() => decide("accepted")}
          style={{
            fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
            padding: "8px 16px", borderRadius: 99,
            border: "1px solid #111", background: "#111", color: "white",
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
