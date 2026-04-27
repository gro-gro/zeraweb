"use client";

import { useMemo, useState } from "react";
import { Leva, useControls, folder, button } from "leva";
import HeroAsciiBackground from "./HeroAsciiBackground";

const DEFAULT_VIDEO = "https://assets.mixkit.co/videos/921/921-1080.mp4";

// Charset presets — each maps a human-readable label to the brightness ramp.
// Order: darkest → brightest (leftmost char = black pixel, rightmost = white).
const CHARSET_PRESETS: Record<string, string> = {
  "Basic":           " .:-=+*#%@",
  "Dense (Bourke)":  " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  "Short":           " .oO@",
  "Blocks":          " ░▒▓█",
  "Dots":            " .·•●",
  "Lines":           " -=≡",
  "Binary":          " 01",
  "Hex":             " 0123456789ABCDEF",
  "Zeratype":        " zeratype",
};

const MAX_VIDEOS = 8;

export default function HeroAsciiDevPanel() {
  const [videoCount, setVideoCount] = useState(1);

  const [values, set] = useControls(() => ({
    Resolution: folder({
      fontSize: { value: 8, min: 4, max: 30, step: 1 },
    }),
    Color: folder({
      charColorLight: { value: "#e2beff", label: "light mode" },
      charColorDark: { value: "#2c1341", label: "dark mode" },
    }),
    Appearance: folder({
      preset: {
        value: CHARSET_PRESETS["Basic"],
        options: CHARSET_PRESETS,
        onChange: (v: string) => set({ charset: v }),
      },
      charset: " .:-=+*#%@",
      invertRampInLightMode: { value: true, label: "invert ramp (light)" },
    }),
    Transform: folder(
      {
        invert: false,
        flipX: false,
        flipY: false,
        charRotation: { value: 0, min: 0, max: 360, step: 1 },
      },
      { collapsed: true }
    ),
    Post: folder(
      {
        thresholdEnabled: { value: false, label: "threshold" },
        thresholdAmount: { value: 0.5, min: 0, max: 1, step: 0.01, label: "  amount" },
      },
      { collapsed: true }
    ),
  }));

  // Dynamic video playlist — leva doesn't have native array inputs, so we
  // rebuild the schema from a counter and use `+` / `-` buttons to resize it.
  const videoSchema = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: Record<string, any> = {};
    for (let i = 0; i < videoCount; i++) {
      fields[`video_${i + 1}`] = {
        value: i === 0 ? DEFAULT_VIDEO : "",
        label: `video ${i + 1}`,
      };
    }
    fields["+ add video"] = button(() =>
      setVideoCount((c) => Math.min(MAX_VIDEOS, c + 1))
    );
    if (videoCount > 1) {
      fields["- remove last"] = button(() =>
        setVideoCount((c) => Math.max(1, c - 1))
      );
    }
    return fields;
  }, [videoCount]);

  const videoValues = useControls("Source", videoSchema, [videoCount]);

  const videoList = useMemo(() => {
    return Object.entries(videoValues)
      .filter(([k]) => k.startsWith("video_"))
      .sort(([a], [b]) => {
        const na = parseInt(a.replace("video_", ""), 10);
        const nb = parseInt(b.replace("video_", ""), 10);
        return na - nb;
      })
      .map(([, v]) => v)
      .filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  }, [videoValues]);

  return (
    <>
      <Leva collapsed titleBar={{ title: "ASCII dev" }} />
      <HeroAsciiBackground
        videoSrc={videoList.length > 0 ? videoList : DEFAULT_VIDEO}
        charset={values.charset}
        charColorLight={values.charColorLight}
        charColorDark={values.charColorDark}
        fontSize={values.fontSize}
        invert={values.invert}
        flipX={values.flipX}
        flipY={values.flipY}
        charRotation={values.charRotation}
        invertRampInLightMode={values.invertRampInLightMode}
        threshold={values.thresholdEnabled ? values.thresholdAmount : null}
      />
    </>
  );
}
