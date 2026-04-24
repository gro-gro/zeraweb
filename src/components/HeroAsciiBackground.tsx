"use client";

import { useEffect, useRef, useState } from "react";

interface HeroAsciiBackgroundProps {
  videoSrc?: string;
  /** Brightness ramp: index 0 = darkest pixel, last = brightest. */
  charset?: string;
  charColor?: string;
  fontSize?: number;
  blur?: number;
}

const DEFAULTS = {
  videoSrc: "https://assets.mixkit.co/videos/921/921-1080.mp4",
  charset: " .:-=+*#%@",
  charColor: "#8650FC",
  fontSize: 14,
  blur: 0.3,
};

function reverse(s: string) {
  return s.split("").reverse().join("");
}

function AsciiCanvas({
  videoSrc,
  charset,
  charColor,
  fontSize,
  blur,
  onFatal,
}: Required<Omit<HeroAsciiBackgroundProps, "videoSrc" | "charset" | "charColor" | "fontSize" | "blur">> & {
  videoSrc: string;
  charset: string;
  charColor: string;
  fontSize: number;
  blur: number;
  onFatal: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    let disposed = false;
    let tInstance: { destroy?: () => void; resizeCanvas?: (w: number, h: number) => void } | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let videoInstance: any = null;
    let ro: ResizeObserver | null = null;
    let mo: MutationObserver | null = null;

    const normal = charset;
    const inverted = reverse(charset);
    const currentCharset = () =>
      document.documentElement.classList.contains("dark") ? normal : inverted;

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let t: any;
      try {
        t = textmode.create({
          canvas,
          width: w,
          height: h,
          fontSize: fontSize * dpr,
          frameRate: 30,
        });
      } catch (err) {
        handleFatal(err);
        return;
      }
      tInstance = t;

      try {
        t.setup(async () => {
          const video = await t.loadVideo(videoSrc);
          video
            .characters(currentCharset())
            .charColorMode("fixed")
            .charColor(charColor)
            .cellColorMode("fixed")
            .cellColor(255, 255, 255, 0);
          video.loop(true);
          videoInstance = video;

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
          if (videoInstance) t.image(videoInstance);
        });
      } catch (err) {
        handleFatal(err);
        return;
      }

      ro = new ResizeObserver(() => {
        if (disposed || !tInstance?.resizeCanvas) return;
        const { w: nw, h: nh } = size();
        try {
          tInstance.resizeCanvas(nw, nh);
        } catch (err) {
          handleFatal(err);
        }
      });
      ro.observe(wrapper);

      mo = new MutationObserver(() => {
        if (videoInstance) {
          try {
            videoInstance.characters(currentCharset());
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
        tInstance?.destroy?.();
      } catch {
        // swallow — destroy during HMR can race with in-flight shader compilation
      }
    };
  }, [videoSrc, charset, charColor, fontSize, onFatal]);

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
  const resolved = { ...DEFAULTS, ...props };
  // `mountKey` forces a fresh <canvas> DOM node if the previous one ended up with
  // a dead/lingering WebGL2 context (typically after an HMR reload).
  const [mountKey, setMountKey] = useState(0);

  return (
    <AsciiCanvas
      key={mountKey}
      videoSrc={resolved.videoSrc}
      charset={resolved.charset}
      charColor={resolved.charColor}
      fontSize={resolved.fontSize}
      blur={resolved.blur}
      onFatal={() => setMountKey((k) => k + 1)}
    />
  );
}
