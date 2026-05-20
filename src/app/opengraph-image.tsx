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
          position: "relative",
        }}
      >
        {/* Background founder image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://mandle.kr/images/founder.jpg"
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "85% 5%",
          }}
        />

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, rgba(0,0,0,0.25), rgba(0,0,0,0.1))",
          }}
        />

      </div>
    ),
    { ...size }
  );
}
