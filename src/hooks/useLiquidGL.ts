"use client";

import { useEffect, useRef, type RefObject } from "react";

declare global {
  interface Window {
    liquidGL: ((options: Record<string, unknown>) => unknown) & {
      registerDynamic: (elements: unknown) => void;
      syncWith: (config?: Record<string, unknown>) => unknown;
    };
    __liquidGLRenderer__: unknown;
    __liquidGLNoWebGL__: boolean;
    html2canvas: unknown;
  }
}

export interface LiquidGLOptions {
  snapshot?: string;
  resolution?: number;
  refraction?: number;
  bevelDepth?: number;
  bevelWidth?: number;
  frost?: number;
  shadow?: boolean;
  specular?: boolean;
  reveal?: "none" | "fade";
  tilt?: boolean;
  tiltFactor?: number;
  magnify?: number;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(), { once: true });
      }
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

export function useLiquidGL(
  ref: RefObject<HTMLElement | null>,
  options: LiquidGLOptions = {}
) {
  const classRef = useRef<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Stable target class for this instance
    if (!classRef.current) {
      classRef.current = `lgl-${Math.random().toString(36).slice(2, 9)}`;
    }
    const targetClass = classRef.current;
    el.classList.add(targetClass);

    let cancelled = false;

    (async () => {
      try {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        );
        if (cancelled) return;
        await loadScript("/scripts/liquidGL.js");
        if (cancelled) return;

        // Wait for the next frame so the DOM is settled
        requestAnimationFrame(() => {
          if (cancelled || typeof window.liquidGL !== "function") return;

          window.liquidGL({
            target: `.${targetClass}`,
            snapshot: options.snapshot ?? "body",
            resolution: options.resolution ?? 2.0,
            refraction: options.refraction ?? 0.01,
            bevelDepth: options.bevelDepth ?? 0.08,
            bevelWidth: options.bevelWidth ?? 0.15,
            frost: options.frost ?? 0,
            shadow: options.shadow ?? true,
            specular: options.specular ?? true,
            reveal: options.reveal ?? "fade",
            tilt: options.tilt ?? false,
            tiltFactor: options.tiltFactor ?? 5,
            magnify: options.magnify ?? 1,
          });
        });
      } catch (err) {
        console.warn("liquidGL: failed to load dependencies", err);
      }
    })();

    return () => {
      cancelled = true;
      el.classList.remove(targetClass);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
