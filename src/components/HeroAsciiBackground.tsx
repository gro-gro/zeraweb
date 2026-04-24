"use client";

import { useEffect, useRef, useState } from "react";

export type AsciiColorMode = "fixed" | "plasma" | "gradient";

export interface HeroAsciiBackgroundProps {
  videoSrc?: string;
  /** Brightness ramp: index 0 = darkest pixel, last = brightest. */
  charset?: string;
  charColor?: string;
  fontSize?: number;
  blur?: number;
  invert?: boolean;
  flipX?: boolean;
  flipY?: boolean;
  /** Degrees, 0–360. Applies only in `fixed` colorMode (video-source path). */
  charRotation?: number;
  /** Reverse the ramp in light mode so dark pixels map to dense glyphs. */
  invertRampInLightMode?: boolean;
  /** Global post-process threshold filter, 0–1. `null` / `undefined` disables. */
  threshold?: number | null;
  /**
   * How to color each character.
   * - `fixed`: single `charColor` for everything (fast GPU path).
   * - `plasma`: animated HSL field, one color per character cell.
   * - `gradient`: linear gradient between `gradientFrom` → `gradientTo`.
   */
  colorMode?: AsciiColorMode;
  plasmaSpeed?: number;
  plasmaScale?: number;
  gradientFrom?: string;
  gradientTo?: string;
  /** Gradient angle in degrees. 0 = left→right, 90 = top→bottom. */
  gradientAngle?: number;
}

const DEFAULTS = {
  videoSrc: "https://assets.mixkit.co/videos/921/921-1080.mp4",
  charset: " .:-=+*#%@",
  charColor: "#8650FC",
  fontSize: 10,
  blur: 0.3,
  invert: false,
  flipX: false,
  flipY: false,
  charRotation: 0,
  invertRampInLightMode: true,
  threshold: null as number | null,
  colorMode: "fixed" as AsciiColorMode,
  plasmaSpeed: 1,
  plasmaScale: 1,
  gradientFrom: "#8650FC",
  gradientTo: "#FF6EC7",
  gradientAngle: 0,
};

type Resolved = typeof DEFAULTS;

function reverse(s: string) {
  return s.split("").reverse().join("");
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// HSL (h,s,l all in 0..1) → RGB 0..255
function hsl2rgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 1 / 6) [r, g, b] = [c, x, 0];
  else if (h < 2 / 6) [r, g, b] = [x, c, 0];
  else if (h < 3 / 6) [r, g, b] = [0, c, x];
  else if (h < 4 / 6) [r, g, b] = [0, x, c];
  else if (h < 5 / 6) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [
    Math.floor((r + m) * 255),
    Math.floor((g + m) * 255),
    Math.floor((b + m) * 255),
  ];
}

function AsciiCanvas({
  videoSrc,
  charset,
  charColor,
  fontSize,
  blur,
  invert,
  flipX,
  flipY,
  charRotation,
  invertRampInLightMode,
  threshold,
  colorMode,
  plasmaSpeed,
  plasmaScale,
  gradientFrom,
  gradientTo,
  gradientAngle,
  onFatal,
}: Resolved & { onFatal: () => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const videoRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tRef = useRef<any>(null);
  const samplerRef = useRef<{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    videoEl: HTMLVideoElement;
  } | null>(null);

  // Dynamic state — draw-loop reads off this ref so we never remount when
  // these change.
  const dynamicRef = useRef({
    charset,
    charColor,
    invert,
    flipX,
    flipY,
    charRotation,
    invertRampInLightMode,
    threshold,
    colorMode,
    plasmaSpeed,
    plasmaScale,
    gradientFrom,
    gradientTo,
    gradientAngle,
  });
  dynamicRef.current = {
    charset,
    charColor,
    invert,
    flipX,
    flipY,
    charRotation,
    invertRampInLightMode,
    threshold,
    colorMode,
    plasmaSpeed,
    plasmaScale,
    gradientFrom,
    gradientTo,
    gradientAngle,
  };

  // Main init effect: only re-runs when params that require atlas/texture
  // rebuild change (videoSrc, fontSize).
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    let disposed = false;
    let ro: ResizeObserver | null = null;
    let mo: MutationObserver | null = null;

    const currentRamp = () => {
      const base = dynamicRef.current.charset;
      const rampInverted = reverse(base);
      const isDark = document.documentElement.classList.contains("dark");
      if (dynamicRef.current.invertRampInLightMode) {
        return isDark ? base : rampInverted;
      }
      return base;
    };

    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const handleFatal = (err: unknown) => {
      if (disposed) return;
      console.warn("[HeroAsciiBackground] init failed, requesting canvas remount:", err);
      onFatal();
    };

    (async () => {
      let textmode: typeof import("textmode.js").textmode;
      try {
        const mod = await import("textmode.js");
        textmode = mod.textmode ?? (mod as unknown as { default: typeof mod.textmode }).default;
      } catch (err) {
        handleFatal(err);
        return;
      }

      if (disposed) return;

      const size = () => {
        const r = wrapper.getBoundingClientRect();
        return {
          w: Math.max(1, Math.floor(r.width * dpr)),
          h: Math.max(1, Math.floor(r.height * dpr)),
        };
      };

      const { w, h } = size();
      canvas.width = w;
      canvas.height = h;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let t: any;
      try {
        t = textmode.create({
          canvas,
          fontSize: fontSize * dpr,
          frameRate: 30,
          loadingScreen: { transition: "none" },
        });
        t.loading?.draw?.(() => {});
      } catch (err) {
        handleFatal(err);
        return;
      }
      tRef.current = t;

      try {
        t.setup(async () => {
          const video = await t.loadVideo(videoSrc);
          const d = dynamicRef.current;
          video
            .characters(currentRamp())
            .charColorMode("fixed")
            .charColor(d.charColor)
            .cellColorMode("fixed")
            .cellColor(255, 255, 255, 0)
            .invert(d.invert)
            .flipX(d.flipX)
            .flipY(d.flipY)
            .charRotation(d.charRotation);
          video.loop(true);
          videoRef.current = video;

          // Set up brightness-sampling canvas for per-cell manual drawing.
          try {
            const videoEl = video.videoElement as HTMLVideoElement;
            const samplerCanvas = document.createElement("canvas");
            samplerCanvas.width = 320;
            samplerCanvas.height = 180;
            const sctx = samplerCanvas.getContext("2d", {
              willReadFrequently: true,
            }) as CanvasRenderingContext2D;
            samplerRef.current = {
              canvas: samplerCanvas,
              ctx: sctx,
              videoEl,
            };
          } catch {
            // sampler is optional — only needed for plasma/gradient modes
          }

          try {
            await video.play();
          } catch {
            const onGesture = () => {
              video?.play().catch(() => {});
              window.removeEventListener("pointerdown", onGesture);
            };
            window.addEventListener("pointerdown", onGesture, { once: true });
          }
        });

        t.draw(() => {
          t.background(255, 255, 255, 0);
          const v = videoRef.current;
          if (!v) return;
          const d = dynamicRef.current;

          // ── Fast path: fixed color, let textmode.js do ASCII via shader.
          if (d.colorMode === "fixed") {
            t.image(v);
            if (typeof d.threshold === "number") t.filter("threshold", d.threshold);
            return;
          }

          // ── Per-cell path: sample video brightness, draw char+color per cell.
          const s = samplerRef.current;
          if (!s || s.videoEl.readyState < 2) return;

          try {
            s.ctx.drawImage(s.videoEl, 0, 0, s.canvas.width, s.canvas.height);
          } catch {
            return;
          }

          const W = s.canvas.width;
          const H = s.canvas.height;
          let data: Uint8ClampedArray;
          try {
            data = s.ctx.getImageData(0, 0, W, H).data;
          } catch {
            return;
          }

          const cols = t.grid.cols as number;
          const rows = t.grid.rows as number;
          if (!cols || !rows) return;

          const rampStr = currentRamp();
          const rampChars = Array.from(rampStr);
          const rampLen = rampChars.length;
          if (rampLen === 0) return;

          const time = ((t.frameCount ?? 0) as number) * 0.02 * d.plasmaSpeed;
          const scale = d.plasmaScale;
          const invertLum = d.invert;
          const fX = d.flipX;
          const fY = d.flipY;

          let fR = 0,
            fG = 0,
            fB = 0,
            tR = 0,
            tG = 0,
            tB = 0,
            dx = 1,
            dy = 0;
          if (d.colorMode === "gradient") {
            [fR, fG, fB] = hexToRgb(d.gradientFrom);
            [tR, tG, tB] = hexToRgb(d.gradientTo);
            const a = (d.gradientAngle * Math.PI) / 180;
            dx = Math.cos(a);
            dy = Math.sin(a);
          }

          for (let gy = 0; gy < rows; gy++) {
            const ny = gy / rows;
            const syNorm = fY ? 1 - ny : ny;
            const sy = Math.min(H - 1, Math.floor(syNorm * H));
            for (let gx = 0; gx < cols; gx++) {
              const nx = gx / cols;
              const sxNorm = fX ? 1 - nx : nx;
              const sx = Math.min(W - 1, Math.floor(sxNorm * W));
              const idx = (sy * W + sx) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];
              let lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              if (invertLum) lum = 1 - lum;
              const ci = Math.min(rampLen - 1, Math.max(0, Math.floor(lum * rampLen)));
              const ch = rampChars[ci];
              if (!ch || ch === " ") continue;

              let cr: number, cg: number, cb: number;
              if (d.colorMode === "plasma") {
                const p1 = Math.sin(nx * 8 * scale + time);
                const p2 = Math.sin(ny * 6 * scale + time * 1.3);
                const p3 = Math.sin((nx + ny) * 4 * scale + time * 0.8);
                const p4 = Math.sin(
                  Math.sqrt(nx * nx + ny * ny) * 12 * scale + time * 1.5
                );
                const intensity = ((p1 + p2 + p3 + p4) / 4 + 1) / 2;
                const hue = (intensity + time * 0.5) % 1;
                [cr, cg, cb] = hsl2rgb(hue < 0 ? hue + 1 : hue, 1, 0.5);
              } else {
                // gradient: project (nx,ny) onto (dx,dy) around the center
                const p = (nx - 0.5) * dx + (ny - 0.5) * dy + 0.5;
                const tv = p < 0 ? 0 : p > 1 ? 1 : p;
                cr = (fR + (tR - fR) * tv) | 0;
                cg = (fG + (tG - fG) * tv) | 0;
                cb = (fB + (tB - fB) * tv) | 0;
              }

              t.charColor(cr, cg, cb);
              t.char(ch);
              t.push();
              t.translate(gx + 1 - cols / 2, gy - rows / 2, 0);
              t.rect(1, 1);
              t.pop();
            }
          }

          if (typeof d.threshold === "number") t.filter("threshold", d.threshold);
        });
      } catch (err) {
        handleFatal(err);
        return;
      }

      ro = new ResizeObserver(() => {
        if (disposed || !tRef.current?.resizeCanvas) return;
        const { w: nw, h: nh } = size();
        try {
          tRef.current.resizeCanvas(nw, nh);
        } catch (err) {
          handleFatal(err);
        }
      });
      ro.observe(wrapper);

      mo = new MutationObserver(() => {
        if (videoRef.current) {
          try {
            videoRef.current.characters(currentRamp());
          } catch {
            // ignore — texture might be disposed mid-swap
          }
        }
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    })().catch(handleFatal);

    return () => {
      disposed = true;
      ro?.disconnect();
      mo?.disconnect();
      try {
        tRef.current?.destroy?.();
      } catch {
        // swallow — destroy during HMR can race with in-flight shader compilation
      }
      tRef.current = null;
      videoRef.current = null;
      samplerRef.current = null;
    };
  }, [videoSrc, fontSize, onFatal]);

  // Live-apply dynamic params to the video source (affects the fixed path).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      const base = charset;
      const rampInverted = reverse(base);
      const isDark = document.documentElement.classList.contains("dark");
      const ramp = invertRampInLightMode ? (isDark ? base : rampInverted) : base;
      v.characters(ramp)
        .charColor(charColor)
        .invert(invert)
        .flipX(flipX)
        .flipY(flipY)
        .charRotation(charRotation);
    } catch {
      // video not ready yet
    }
  }, [charset, charColor, invert, flipX, flipY, charRotation, invertRampInLightMode]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{
          filter: `blur(${blur}px)`,
          WebkitMaskImage:
            "radial-gradient(ellipse 30% 38% at 50% 52%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.15) 80%, rgba(0,0,0,0) 100%)",
          maskImage:
            "radial-gradient(ellipse 30% 38% at 50% 52%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.15) 80%, rgba(0,0,0,0) 100%)",
        }}
      />
    </div>
  );
}

export default function HeroAsciiBackground(props: HeroAsciiBackgroundProps = {}) {
  const resolved: Resolved = { ...DEFAULTS, ...props };
  // `mountKey` forces a fresh <canvas> DOM node if the previous one ended up with
  // a dead/lingering WebGL2 context (typically after an HMR reload).
  const [mountKey, setMountKey] = useState(0);

  return (
    <AsciiCanvas
      key={mountKey}
      {...resolved}
      onFatal={() => setMountKey((k) => k + 1)}
    />
  );
}
