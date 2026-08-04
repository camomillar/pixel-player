import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
  // Nothing is captured and no analytics cookie is set until the visitor
  // accepts in the consent banner (components/CookieConsent.tsx).
  opt_out_capturing_by_default: true,
});
