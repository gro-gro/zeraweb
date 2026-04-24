"use client";

import { Leva, useControls, folder } from "leva";
import HeroAsciiBackground, { type AsciiColorMode } from "./HeroAsciiBackground";

export default function HeroAsciiDevPanel() {
  const values = useControls({
    Resolution: folder({
      fontSize: { value: 10, min: 4, max: 30, step: 1 },
    }),
    Color: folder({
      colorMode: {
        value: "fixed" as AsciiColorMode,
        options: ["fixed", "plasma", "gradient"] as const,
      },
      charColor: { value: "#8650FC", render: (get) => get("Color.colorMode") === "fixed" },
      gradientFrom: {
        value: "#8650FC",
        render: (get) => get("Color.colorMode") === "gradient",
      },
      gradientTo: {
        value: "#FF6EC7",
        render: (get) => get("Color.colorMode") === "gradient",
      },
      gradientAngle: {
        value: 0,
        min: 0,
        max: 360,
        step: 1,
        render: (get) => get("Color.colorMode") === "gradient",
      },
      plasmaSpeed: {
        value: 1,
        min: 0,
        max: 4,
        step: 0.05,
        render: (get) => get("Color.colorMode") === "plasma",
      },
      plasmaScale: {
        value: 1,
        min: 0.2,
        max: 4,
        step: 0.05,
        render: (get) => get("Color.colorMode") === "plasma",
      },
    }),
    Appearance: folder({
      charset: " .:-=+*#%@",
      blur: { value: 0.3, min: 0, max: 4, step: 0.05 },
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
    Source: folder(
      {
        videoSrc: "https://assets.mixkit.co/videos/921/921-1080.mp4",
      },
      { collapsed: true }
    ),
  });

  return (
    <>
      <Leva collapsed titleBar={{ title: "ASCII dev" }} />
      <HeroAsciiBackground
        videoSrc={values.videoSrc}
        charset={values.charset}
        charColor={values.charColor}
        fontSize={values.fontSize}
        blur={values.blur}
        invert={values.invert}
        flipX={values.flipX}
        flipY={values.flipY}
        charRotation={values.charRotation}
        invertRampInLightMode={values.invertRampInLightMode}
        threshold={values.thresholdEnabled ? values.thresholdAmount : null}
        colorMode={values.colorMode as AsciiColorMode}
        plasmaSpeed={values.plasmaSpeed}
        plasmaScale={values.plasmaScale}
        gradientFrom={values.gradientFrom}
        gradientTo={values.gradientTo}
        gradientAngle={values.gradientAngle}
      />
    </>
  );
}
