"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { decodePlaylist } from "@/lib/encode";
import SharePageContent from "@/components/SharePageContent";

/**
 * Legacy share links carry the whole playlist encoded in the `d` parameter.
 * Current links use the shorter /s/<id> form, but these are still out in the
 * wild, so they render through the same Deezer-backed view.
 */
function ShareContent() {
  const encoded = useSearchParams().get("d");
  const playlist = encoded ? decodePlaylist(encoded) : null;

  if (!playlist) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, textAlign: "center",
      }}>
        <p style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 14, color: "#888" }}>
          This link could not be opened.{" "}
          <a href="/" style={{ color: "#444" }}>Make your own playlist</a>
        </p>
      </div>
    );
  }

  return <SharePageContent playlist={playlist} />;
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 14, color: "#999" }}>Loading…</p>
      </div>
    }>
      <ShareContent />
    </Suspense>
  );
}
