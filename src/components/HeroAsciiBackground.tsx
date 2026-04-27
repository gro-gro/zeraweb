"use client";

import { useEffect, useRef, useState } from "react";

export interface HeroAsciiBackgroundProps {
  /** Single URL or a playlist. When array is provided with >1 entries, each
   *  video plays once in order and the next starts on `ended`; cycles forever. */
  videoSrc?: string | string[];
  /** Brightness ramp: index 0 = darkest pixel, last = brightest. */
  charset?: string;
  /** ASCII color used in light mode. */
  charColorLight?: string;
  /** ASCII color used in dark mode. */
  charColorDark?: string;
  fontSize?: number;
  invert?: boolean;
  flipX?: boolean;
  flipY?: boolean;
  /** Degrees, 0–360. */
  charRotation?: number;
  /** Reverse the ramp in light mode so dark pixels map to dense glyphs. */
  invertRampInLightMode?: boolean;
  /** Global post-process threshold filter, 0–1. `null` / `undefined` disables. */
  threshold?: number | null;
}

const DEFAULTS = {
  videoSrc: "https://assets.mixkit.co/videos/921/921-1080.mp4",
  charset: " .:-=+*#%@",
  charColorLight: "#e2beff",
  charColorDark: "#2c1341",
  fontSize: 10,
  invert: false,
  flipX: false,
  flipY: false,
  charRotation: 0,
  invertRampInLightMode: true,
  threshold: null as number | null,
};

type Resolved = Omit<typeof DEFAULTS, "videoSrc"> & { videoSrcs: string[] };

function reverse(s: string) {
  return s.split("").reverse().join("");
}

function resolveCharColor(
  isDark: boolean,
  light: string,
  dark: string
): string {
  return isDark ? dark : light;
}

function AsciiCanvas({
  videoSrcs,
  charset,
  charColorLight,
  charColorDark,
  fontSize,
  invert,
  flipX,
  flipY,
  charRotation,
  invertRampInLightMode,
  threshold,
  onFatal,
}: Resolved & { onFatal: () => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealCanvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const videoRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tRef = useRef<any>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  // Playlist state — kept in a ref so the ended-listener below always sees the
  // latest sources without tearing down the textmode instance.
  const playlistRef = useRef<{ sources: string[]; index: number }>({
    sources: videoSrcs,
    index: 0,
  });
  useEffect(() => {
    const pl = playlistRef.current;
    pl.sources = videoSrcs;
    if (pl.index >= videoSrcs.length) pl.index = 0;
  }, [videoSrcs]);

  const initialVideoSrc = videoSrcs[0];

  // Dynamic state — draw-loop reads off this ref so we never remount when
  // these change.
  const dynamicRef = useRef({
    charset,
    charColorLight,
    charColorDark,
    invert,
    flipX,
    flipY,
    charRotation,
    invertRampInLightMode,
    threshold,
  });
  dynamicRef.current = {
    charset,
    charColorLight,
    charColorDark,
    invert,
    flipX,
    flipY,
    charRotation,
    invertRampInLightMode,
    threshold,
  };

  // Main init effect: only re-runs when params that require atlas/texture
  // rebuild change (initialVideoSrc, fontSize).
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    let disposed = false;
    let ro: ResizeObserver | null = null;
    let mo: MutationObserver | null = null;
    let io: IntersectionObserver | null = null;
    let attachedVideoEl: HTMLVideoElement | null = null;
    let videoEndedHandler: (() => void) | null = null;
    let revealPlayingHandler: (() => void) | null = null;
    let revealRafId = 0;
    let revealFailsafeId: number | undefined;
    let revealStarted = false;
    // Flipped by IntersectionObserver — when the hero scrolls off-screen we
    // bail from the draw loop and pause the video decode.
    let paused = false;

    const isDark = () => document.documentElement.classList.contains("dark");

    const currentRamp = () => {
      const base = dynamicRef.current.charset;
      const rampInverted = reverse(base);
      if (dynamicRef.current.invertRampInLightMode) {
        return isDark() ? base : rampInverted;
      }
      return base;
    };

    const currentCharColor = () =>
      resolveCharColor(
        isDark(),
        dynamicRef.current.charColorLight,
        dynamicRef.current.charColorDark
      );

    // Cap DPR at 1×. The visual impact is imperceptible for the ASCII grid
    // (cells are rasterized at font-size pixels either way) and it cuts
    // backing-store pixel count by ~75% on retina screens.
    const dpr = Math.min(1, window.devicePixelRatio || 1);

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

      const startReveal = () => {
        if (revealStarted || disposed) return;
        revealStarted = true;
        const overlay = revealCanvasRef.current;
        if (!overlay) return;
        overlay.width = canvas.width;
        overlay.height = canvas.height;
        const ctx = overlay.getContext("2d");
        if (!ctx) return;

        const bg =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--background")
            .trim() || (isDark() ? "#000000" : "#ffffff");
        const cell = Math.max(1, fontSize * dpr);
        const cols = Math.ceil(overlay.width / cell);
        const rows = Math.ceil(overlay.height / cell);
        const total = cols * rows;
        if (total <= 0) {
          overlay.style.display = "none";
          return;
        }

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, overlay.width, overlay.height);
        overlay.style.display = "";

        const order = new Uint32Array(total);
        for (let i = 0; i < total; i++) order[i] = i;
        for (let i = total - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const tmp = order[i];
          order[i] = order[j];
          order[j] = tmp;
        }

        const duration = 1400;
        const startTs = performance.now();
        let revealed = 0;

        const tick = (now: number) => {
          if (disposed) return;
          const elapsed = now - startTs;
          const eased = Math.min(1, elapsed / duration);
          const progress =
            eased < 0.5
              ? 4 * eased * eased * eased
              : 1 - Math.pow(-2 * eased + 2, 3) / 2;
          const target = Math.floor(progress * total);
          while (revealed < target) {
            const idx = order[revealed++];
            const cx = (idx % cols) * cell;
            const cy = Math.floor(idx / cols) * cell;
            ctx.clearRect(cx, cy, cell, cell);
          }
          if (eased < 1) {
            revealRafId = requestAnimationFrame(tick);
          } else {
            overlay.style.display = "none";
          }
        };
        revealRafId = requestAnimationFrame(tick);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let t: any;
      try {
        t = textmode.create({
          canvas,
          fontSize: fontSize * dpr,
          // Match common video frame rate — 24fps here was causing visible
          // judder because the source video ticks at 30fps.
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
          const video = await t.loadVideo(initialVideoSrc);
          const d = dynamicRef.current;
          const isPlaylist = playlistRef.current.sources.length > 1;
          video
            .characters(currentRamp())
            .charColorMode("fixed")
            .charColor(currentCharColor())
            .cellColorMode("fixed")
            .cellColor(255, 255, 255, 0)
            .invert(d.invert)
            .flipX(d.flipX)
            .flipY(d.flipY)
            .charRotation(d.charRotation);
          // Single video = native loop. Playlist = we swap src on 'ended'.
          video.loop(!isPlaylist);
          videoRef.current = video;

          let videoEl: HTMLVideoElement | null = null;
          try {
            videoEl = video.videoElement as HTMLVideoElement;
            videoElRef.current = videoEl;
          } catch {
            // videoElement access shouldn't throw, but don't crash init if it does
          }

          // Playlist: on 'ended', swap the <video>'s src to the next entry.
          if (videoEl) {
            videoEndedHandler = () => {
              const pl = playlistRef.current;
              if (pl.sources.length <= 1) return;
              pl.index = (pl.index + 1) % pl.sources.length;
              const next = pl.sources[pl.index];
              if (!next || !videoEl) return;
              videoEl.src = next;
              videoEl.load();
              videoEl.play().catch(() => {});
            };
            attachedVideoEl = videoEl;
            videoEl.addEventListener("ended", videoEndedHandler);

            revealPlayingHandler = () => startReveal();
            videoEl.addEventListener("playing", revealPlayingHandler, { once: true });
          }
          // Failsafe in case 'playing' never fires (e.g. autoplay blocked
          // and user never interacts). Capped at 2.5s so the page never
          // sits behind a solid overlay forever.
          revealFailsafeId = window.setTimeout(startReveal, 2500);

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
          if (paused) return;
          t.background(255, 255, 255, 0);
          const v = videoRef.current;
          if (!v) return;
          const d = dynamicRef.current;
          t.image(v);
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
            videoRef.current.characters(currentRamp()).charColor(currentCharColor());
          } catch {
            // ignore — texture might be disposed mid-swap
          }
        }
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

      // Pause the draw loop + video decode when the hero scrolls off-screen.
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          const visible = entry.isIntersecting;
          paused = !visible;
          const videoEl = videoElRef.current;
          if (videoEl) {
            if (visible) {
              videoEl.play().catch(() => {});
            } else {
              videoEl.pause();
            }
          }
        },
        { threshold: 0 }
      );
      io.observe(wrapper);
    })().catch(handleFatal);

    return () => {
      disposed = true;
      ro?.disconnect();
      mo?.disconnect();
      io?.disconnect();
      if (revealRafId) cancelAnimationFrame(revealRafId);
      if (revealFailsafeId !== undefined) window.clearTimeout(revealFailsafeId);
      if (attachedVideoEl && videoEndedHandler) {
        attachedVideoEl.removeEventListener("ended", videoEndedHandler);
      }
      if (attachedVideoEl && revealPlayingHandler) {
        attachedVideoEl.removeEventListener("playing", revealPlayingHandler);
      }
      try {
        tRef.current?.destroy?.();
      } catch {
        // swallow — destroy during HMR can race with in-flight shader compilation
      }
      tRef.current = null;
      videoRef.current = null;
      videoElRef.current = null;
    };
  }, [initialVideoSrc, fontSize, onFatal]);

  // Live-apply dynamic params. Color resolves against the current theme.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      const base = charset;
      const rampInverted = reverse(base);
      const isDark = document.documentElement.classList.contains("dark");
      const ramp = invertRampInLightMode ? (isDark ? base : rampInverted) : base;
      const color = resolveCharColor(isDark, charColorLight, charColorDark);
      v.characters(ramp)
        .charColor(color)
        .invert(invert)
        .flipX(flipX)
        .flipY(flipY)
        .charRotation(charRotation);
    } catch {
      // video not ready yet
    }
  }, [charset, charColorLight, charColorDark, invert, flipX, flipY, charRotation, invertRampInLightMode]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <canvas
        ref={revealCanvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full"
      />
      {/*
       * Faux-mask: a solid radial gradient fading to the page background
       * replaces `mask-image: radial-gradient(...)` on the canvas. Alpha-masks
       * force an extra compositor pass per frame; a plain layer stacked on
       * top is ~an order of magnitude cheaper to re-composite.
       */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 30% 38% at 50% 52%, transparent 40%, var(--background) 100%)",
        }}
      />
    </div>
  );
}

export default function HeroAsciiBackground(props: HeroAsciiBackgroundProps = {}) {
  const { videoSrc, ...rest } = props;
  const raw = videoSrc ?? DEFAULTS.videoSrc;
  const list = Array.isArray(raw) ? raw : [raw];
  const clean = list.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  const videoSrcs = clean.length > 0 ? clean : [DEFAULTS.videoSrc];

  const baseDefaults: Omit<typeof DEFAULTS, "videoSrc"> = (() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { videoSrc: _v, ...d } = DEFAULTS;
    return d;
  })();
  const resolved: Resolved = { ...baseDefaults, ...rest, videoSrcs };

  // `mountKey` forces a fresh <canvas> DOM node if the previous one ended up
  // with a dead/lingering WebGL2 context (typically after an HMR reload).
  const [mountKey, setMountKey] = useState(0);

  return (
    <AsciiCanvas
      key={mountKey}
      {...resolved}
      onFatal={() => setMountKey((k) => k + 1)}
    />
  );
}
