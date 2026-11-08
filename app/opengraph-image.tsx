import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content";

export const dynamic = "force-static";
export const alt = `${SITE.name} — ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STATS = [
  ["3 yrs", "production"],
  ["99.9%", "uptime"],
  ["500K+", "msgs / hour"],
  ["10K+", "WebSockets"],
];

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#111",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 28, color: "#6f6f6f" }}>sauravsharma.info</div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 20px",
              borderRadius: 999,
              border: "1px solid #ececec",
              fontSize: 22,
              color: "#333",
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#63d94e" }} />
            Open to SDE roles
          </div>
        </div>
        <div style={{ marginTop: 56, fontSize: 92, fontWeight: 700, letterSpacing: -4, color: "#111", lineHeight: 1 }}>
          Saurav Sharma
        </div>
        <div style={{ marginTop: 18, fontSize: 44, fontWeight: 600, letterSpacing: -1.5, color: "#8d8d8d", lineHeight: 1.15 }}>
          Software Engineer — backend, distributed systems & production GenAI
        </div>
        <div style={{ marginTop: "auto", display: "flex", gap: 16 }}>
          {STATS.map(([big, small]) => (
            <div
              key={big}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                background: "#f4f4f4",
                borderRadius: 24,
                padding: "22px 26px",
              }}
            >
              <div style={{ fontSize: 44, fontWeight: 700, color: "#111", letterSpacing: -1.5 }}>{big}</div>
              <div style={{ fontSize: 22, color: "#666" }}>{small}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
