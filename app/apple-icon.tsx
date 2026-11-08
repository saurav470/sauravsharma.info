import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111",
          color: "#fff",
          fontSize: 120,
          fontWeight: 700,
          position: "relative",
        }}
      >
        S
        <div
          style={{ position: "absolute", right: 34, bottom: 34, width: 24, height: 24, borderRadius: 12, background: "#F5C542" }}
        />
      </div>
    ),
    size,
  );
}
