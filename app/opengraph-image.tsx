import { ImageResponse } from "next/og";
import { site } from "@/data";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#fbfbf9",
          color: "#15171c",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 4, color: "#2a3cf0", textTransform: "uppercase" }}>
          Applied AI · Software Engineering
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: -2 }}>{site.name}</div>
          <div style={{ fontSize: 36, color: "#5a6070", marginTop: 16 }}>
            Machine Learning · Data Science · Research
          </div>
        </div>
      </div>
    ),
    size,
  );
}
