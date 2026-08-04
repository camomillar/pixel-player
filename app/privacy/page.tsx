"use client";
import { useEffect, useState } from "react";
import { applyConsent, readConsent, type Consent } from "@/lib/consent";

const F = "system-ui, -apple-system, sans-serif";

const h2: React.CSSProperties = { fontFamily: F, fontSize: 15, fontWeight: 700, color: "#111", margin: "28px 0 8px" };
const p: React.CSSProperties = { fontFamily: F, fontSize: 14, color: "#444", lineHeight: 1.65, margin: "0 0 10px" };
const li: React.CSSProperties = { ...p, margin: "0 0 6px" };

function ConsentControl() {
  const [choice, setChoice] = useState<Consent | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setChoice(readConsent());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const set = (c: Consent) => { applyConsent(c); setChoice(c); };

  return (
    <div style={{
      background: "#f7f7f8", border: "1px solid #e8e8ea", borderRadius: 12,
      padding: "14px 16px", margin: "12px 0 4px",
    }}>
      <p style={{ ...p, margin: "0 0 10px" }}>
        Current choice:{" "}
        <strong style={{ color: "#111" }}>
          {choice === "accepted" ? "analytics accepted" : choice === "declined" ? "analytics declined" : "not set yet"}
        </strong>
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={() => set("accepted")}
          style={{ fontFamily: F, fontSize: 13, cursor: "pointer", padding: "8px 14px", borderRadius: 99, border: "1px solid #ddd", background: choice === "accepted" ? "#111" : "white", color: choice === "accepted" ? "white" : "#555" }}
        >
          Accept analytics
        </button>
        <button
          onClick={() => set("declined")}
          style={{ fontFamily: F, fontSize: 13, cursor: "pointer", padding: "8px 14px", borderRadius: 99, border: "1px solid #ddd", background: choice === "declined" ? "#111" : "white", color: choice === "declined" ? "white" : "#555" }}
        >
          Decline analytics
        </button>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px 80px" }}>
        <h1 style={{ fontFamily: "'BitcountGrid', monospace", fontSize: 24, color: "#111", margin: "0 0 6px" }}>
          Privacy &amp; cookies
        </h1>
        <p style={{ ...p, color: "#888", fontSize: 12 }}>Last updated: 3 August 2026</p>

        <p style={p}>
          songs4u is a personal project that lets you build a small playlist and share it as a link.
          This page explains what it stores and what it sends to other services.
        </p>

        <h2 style={h2}>Analytics — only if you accept</h2>
        <p style={p}>
          The site uses PostHog to count how it is being used: page views and a few actions such as
          adding a song, creating a playlist and opening a shared playlist. Nothing is captured and
          no analytics cookie is set until you press Accept in the banner. If you decline, PostHog
          stays switched off.
        </p>
        <p style={p}>
          When accepted, PostHog stores a first-party cookie (named <code>ph_&lt;project&gt;_posthog</code>)
          holding a random identifier, so repeat visits from the same browser are counted as one
          person. Requests are proxied through this site&rsquo;s own <code>/ingest</code> path.
        </p>
        <ConsentControl />

        <h2 style={h2}>Playlists you create</h2>
        <p style={p}>
          When you generate a link, the playlist is saved so the recipient can open it. That record
          contains whatever you typed &mdash; the two names, the title, the message, your chosen
          songs, and the cover photo if you added one. It is stored for one year and then deleted
          automatically. Anyone holding the link can view it, so treat the link as the key.
        </p>

        <h2 style={h2}>Music data</h2>
        <p style={p}>
          Song search and previews come from Deezer. Your search terms are sent from this site&rsquo;s
          server to the Deezer API to fetch results; album art and preview audio are loaded from
          Deezer.
        </p>

        <h2 style={h2}>Other cookies</h2>
        <ul style={{ paddingLeft: 20, margin: "0 0 10px" }}>
          <li style={li}>
            <strong>Your cookie choice.</strong>{" "}Your accept/decline answer is kept in your
            browser&rsquo;s local storage so you are not asked on every visit.
          </li>
          <li style={li}>
            <strong>Vercel Analytics.</strong> The site is hosted on Vercel, whose analytics counts
            page views without using cookies.
          </li>
        </ul>

        <h2 style={h2}>Your choices</h2>
        <p style={p}>
          You can change your analytics choice at any time using the buttons above. To remove a
          playlist you created before its year is up, or to ask what is stored, get in touch using
          the contact below.
        </p>

        <h2 style={h2}>Contact</h2>
        <p style={p}>
          For anything on this page &mdash; including removing a playlist you made &mdash; reach me
          on{" "}
          <a
            href="https://www.linkedin.com/in/almeida-camilla/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#444" }}
          >
            LinkedIn
          </a>.
        </p>

        <p style={{ ...p, marginTop: 32 }}>
          <a href="/" style={{ color: "#444" }}>← Back to songs4u</a>
        </p>
      </div>
    </div>
  );
}
