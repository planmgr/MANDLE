import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MANDLE — Style is Presence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          position: "relative",
        }}
      >
        {/* Accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: "#c8a96e",
          }}
        />

        {/* Center logo image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://mandle.kr/images/logo-white.png"
          alt="MANDLE"
          height={48}
          style={{ height: 48 }}
        />
        <div
          style={{
            fontSize: 16,
            color: "#c8a96e",
            letterSpacing: 6,
            fontFamily: "sans-serif",
            marginTop: 24,
          }}
        >
          STYLE IS PRESENCE
        </div>
      </div>
    ),
    { ...size }
  );
}
