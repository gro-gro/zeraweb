"use client";

import { useEffect, useRef, type RefObject } from "react";

/* ═══════════════════════════════════════════════════════════════════ */
/*  Liquid Glass — SVG feDisplacementMap + Snell's-law refraction     */
/*  Based on kube.io/blog/liquid-glass-css-svg                        */
/*                                                                     */
/*  Chrome  → SVG filter with feDisplacementMap via backdrop-filter   */
/*  Firefox → JS pixel displacement on <canvas> (feImage+data URLs   */
/*            are broken in Gecko: bugzil.la/455986)                  */
/* ═══════════════════════════════════════════════════════════════════ */

export interface LiquidGlassOptions {
  ior?: number;            // refractive index (default 1.5)
  scale?: number;          // displacement px  (default 80)
  specular?: number;       // rim-light opacity 0-1 (default 0.35)
  lightAngle?: number;     // specular light direction in degrees (default 225 = top-left)
  lightIntensity?: number; // specular brightness multiplier (default 2.2)
  bevelWidth?: number;     // 0-1 — fraction of radius affected by bevel (default 1)
  frost?: number;          // backdrop blur px (default 0)
  tint?: number;           // bg white overlay opacity 0-0.5 (default 0.03)
  borderOpacity?: number;  // border white opacity 0-0.5 (default 0.15)
}

/* ── Surface profiles ─────────────────────────────────────────────── */

const convex = (t: number) => Math.sqrt(Math.max(0, 1 - (1 - t) * (1 - t)));
const concave = (t: number) => 1 - convex(t);
const smootherstep = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
};
const lip = (t: number) => {
  const s = smootherstep(t);
  return convex(t) * (1 - s) + concave(t) * s;
};

/* ── Signed radial displacement via Snell's law ───────────────────── */

function computeRadialProfile(samples: number, ior: number): Float32Array {
  const out = new Float32Array(samples);
  const d = 0.001;
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    const slope = (lip(Math.min(1, t + d)) - lip(Math.max(0, t - d))) / (2 * d);
    const len = Math.sqrt(slope * slope + 1);
    const cosI = 1 / len;
    const sinI = Math.sqrt(Math.max(0, 1 - cosI * cosI));
    const sinR = sinI / ior;
    out[i] = -Math.sign(slope) * (sinI - sinR);
  }
  let peak = 0;
  for (let i = 0; i < samples; i++) peak = Math.max(peak, Math.abs(out[i]));
  if (peak > 0) for (let i = 0; i < samples; i++) out[i] /= peak;
  return out;
}

/* ── Capsule SDF ──────────────────────────────────────────────────── */

function capsule(
  px: number, py: number, cx: number, cy: number, hs: number, r: number,
): [number, number, number] {
  const dx = px - cx, dy = py - cy;
  const cl = Math.max(-hs, Math.min(hs, dx));
  const lx = dx - cl, ly = dy;
  return [lx, ly, Math.min(1, Math.sqrt(lx * lx + ly * ly) / r)];
}

/* ── Map generators (return raw pixel data + data URL) ────────────── */

interface MapResult {
  url: string;
  pixels: Uint8ClampedArray;
  w: number;
  h: number;
}

function generateDisplacementMap(elW: number, elH: number, pad: number, ior: number, bevelWidth: number): MapResult {
  const w = elW + pad * 2, h = elH + pad * 2;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const p = img.data;

  const N = 128, profile = computeRadialProfile(N, ior);
  const cx = w / 2, cy = h / 2;
  const r = Math.min(elW, elH) / 2;
  const hs = Math.max(0, elW / 2 - r);
  const bw = Math.max(0.01, bevelWidth);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const [lx, ly, t] = capsule(x, y, cx, cy, hs, r);
      if (t >= 1) { p[i] = 128; p[i + 1] = 128; p[i + 2] = 128; p[i + 3] = 255; continue; }
      // Remap t so bevel only affects the outer `bevelWidth` fraction
      const tBevel = Math.max(0, Math.min(1, (t - (1 - bw)) / bw));
      const disp = profile[Math.min(N - 1, Math.floor(tBevel * (N - 1)))];
      const a = Math.atan2(ly, lx);
      p[i]     = Math.round(128 + Math.cos(a) * disp * 127);
      p[i + 1] = Math.round(128 + Math.sin(a) * disp * 127);
      p[i + 2] = 128; p[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return { url: canvas.toDataURL("image/png"), pixels: p, w, h };
}

function generateSpecularMap(elW: number, elH: number, pad: number, lightAngleDeg: number, lightIntensity: number, bevelWidth: number): MapResult {
  const w = elW + pad * 2, h = elH + pad * 2;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const p = img.data;

  const cx = w / 2, cy = h / 2;
  const r = Math.min(elW, elH) / 2;
  const hs = Math.max(0, elW / 2 - r);
  const d = 0.002;
  const lightDir = (lightAngleDeg * Math.PI) / 180;
  const bw = Math.max(0.01, bevelWidth);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const [lx, ly, t] = capsule(x, y, cx, cy, hs, r);
      if (t >= 1) { p[i] = p[i + 1] = p[i + 2] = p[i + 3] = 0; continue; }
      const tBevel = Math.max(0, Math.min(1, (t - (1 - bw)) / bw));
      const slope = Math.abs((lip(Math.min(1, tBevel + d)) - lip(Math.max(0, tBevel - d))) / (2 * d));
      const facing = Math.max(0, Math.cos(Math.atan2(ly, lx) - lightDir));
      const v = Math.min(255, Math.round(slope * facing * lightIntensity * 255));
      p[i] = v; p[i + 1] = v; p[i + 2] = v; p[i + 3] = v;
    }
  }
  ctx.putImageData(img, 0, 0);
  return { url: canvas.toDataURL("image/png"), pixels: p, w, h };
}

/* ── SVG filter builder (Chrome only) ─────────────────────────────── */

const NS = "http://www.w3.org/2000/svg";

function svgEl(tag: string, attrs: Record<string, string>): SVGElement {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

function setupChromeRenderer(
  badge: HTMLElement, id: string,
  pad: number, tw: number, th: number,
  scale: number, frost: number, specular: number,
  dispUrl: string, specUrl: string | null,
): () => void {
  const svg = document.createElementNS(NS, "svg");
  Object.assign(svg.style, { position: "absolute", width: "0", height: "0", pointerEvents: "none" });

  const f = svgEl("filter", {
    id, filterUnits: "userSpaceOnUse", primitiveUnits: "userSpaceOnUse",
    x: `${-pad}`, y: `${-pad}`, width: `${tw}`, height: `${th}`,
    "color-interpolation-filters": "sRGB",
  });
  const imgAttrs = { x: `${-pad}`, y: `${-pad}`, width: `${tw}`, height: `${th}` };

  f.appendChild(svgEl("feImage", { href: dispUrl, result: "dm", ...imgAttrs }));
  f.appendChild(svgEl("feDisplacementMap", {
    in: "SourceGraphic", in2: "dm", scale: `${scale}`,
    xChannelSelector: "R", yChannelSelector: "G", result: "refr",
  }));

  let lastResult = "refr";
  if (frost > 0) {
    f.appendChild(svgEl("feGaussianBlur", { in: lastResult, stdDeviation: `${frost}`, result: "frosted" }));
    lastResult = "frosted";
  }

  if (specUrl && specular > 0) {
    f.appendChild(svgEl("feImage", { href: specUrl, result: "spec", ...imgAttrs }));
    f.appendChild(svgEl("feComposite", {
      in: "spec", in2: lastResult, operator: "arithmetic",
      k1: "0", k2: `${specular}`, k3: "1", k4: "0",
    }));
  }

  svg.appendChild(f);
  document.body.appendChild(svg);

  badge.style.backdropFilter = `url(#${id})`;
  badge.style.setProperty("-webkit-backdrop-filter", `url(#${id})`);

  return () => {
    badge.style.backdropFilter = "";
    badge.style.setProperty("-webkit-backdrop-filter", "");
    svg.remove();
  };
}

/* ── Canvas + JS pixel displacement (Firefox / Safari) ────────────── */
/*  feImage with data: URLs is broken in Gecko (Bug 455986), and      */
/*  backdrop-filter with SVG refs doesn't render in Firefox/Safari.   */
/*  Instead we capture the video frame to canvas and apply the        */
/*  displacement map directly in JavaScript.                          */

function setupCanvasRenderer(
  badge: HTMLElement,
  pad: number, tw: number, th: number,
  scale: number, frost: number, specular: number,
  dispPixels: Uint8ClampedArray,
  specPixels: Uint8ClampedArray | null,
): () => void {
  const section = badge.closest("section");
  if (!section) return () => {};
  const videos = section.querySelectorAll<HTMLVideoElement>("video");
  if (!videos.length) return () => {};

  // Pre-compute displacement offsets (once)
  const offX = new Int16Array(tw * th);
  const offY = new Int16Array(tw * th);
  for (let i = 0; i < tw * th; i++) {
    const pi = i * 4;
    offX[i] = Math.round(scale * (dispPixels[pi] / 255 - 0.5));
    offY[i] = Math.round(scale * (dispPixels[pi + 1] / 255 - 0.5));
  }

  // Pre-scale specular values
  let specValues: Uint8Array | null = null;
  if (specPixels && specular > 0) {
    specValues = new Uint8Array(tw * th);
    for (let i = 0; i < tw * th; i++) {
      specValues[i] = Math.round(specPixels[i * 4] * specular);
    }
  }

  // Offscreen canvas for video capture
  const offCvs = document.createElement("canvas");
  offCvs.width = tw; offCvs.height = th;
  const offCtx = offCvs.getContext("2d", { willReadFrequently: true })!;

  // Visible canvas
  const visCvs = document.createElement("canvas");
  visCvs.width = tw; visCvs.height = th;
  Object.assign(visCvs.style, {
    position: "absolute",
    left: `${-pad}px`, top: `${-pad}px`,
    width: `${tw}px`, height: `${th}px`,
    pointerEvents: "none", zIndex: "0",
    filter: frost > 0 ? `blur(${frost}px)` : "none",
  });
  const visCtx = visCvs.getContext("2d")!;

  badge.style.overflow = "hidden";
  badge.insertBefore(visCvs, badge.firstChild);

  let running = true;

  function render() {
    if (!running) return;
    requestAnimationFrame(render);

    // Find current visible video
    let video: HTMLVideoElement | null = null;
    for (const v of videos) {
      if (!v.classList.contains("invisible") && v.readyState >= 2) { video = v; break; }
    }
    if (!video || !video.videoWidth || !video.videoHeight) return;

    const br = badge.getBoundingClientRect();
    const vr = video.getBoundingClientRect();
    const nw = video.videoWidth, nh = video.videoHeight;

    // object-fit: cover source rect
    const cAsp = vr.width / vr.height, vAsp = nw / nh;
    let cropW: number, cropH: number, cropX: number, cropY: number;
    if (vAsp > cAsp) {
      cropH = nh; cropW = nh * cAsp; cropX = (nw - cropW) / 2; cropY = 0;
    } else {
      cropW = nw; cropH = nw / cAsp; cropX = 0; cropY = (nh - cropH) / 2;
    }

    const rx = (br.left - pad - vr.left) / vr.width;
    const ry = (br.top - pad - vr.top) / vr.height;
    const rw = tw / vr.width, rh = th / vr.height;

    try {
      offCtx.drawImage(
        video,
        cropX + rx * cropW, cropY + ry * cropH,
        rw * cropW, rh * cropH,
        0, 0, tw, th,
      );

      const src = offCtx.getImageData(0, 0, tw, th).data;
      const out = visCtx.createImageData(tw, th);
      const dst = out.data;

      for (let y = 0; y < th; y++) {
        for (let x = 0; x < tw; x++) {
          const idx = y * tw + x;
          const oi = idx * 4;
          const sx = x + offX[idx];
          const sy = y + offY[idx];

          if (sx >= 0 && sx < tw && sy >= 0 && sy < th) {
            const si = (sy * tw + sx) * 4;
            dst[oi]     = src[si];
            dst[oi + 1] = src[si + 1];
            dst[oi + 2] = src[si + 2];
            dst[oi + 3] = 255;

            // Additive specular
            if (specValues) {
              const sv = specValues[idx];
              dst[oi]     = Math.min(255, dst[oi] + sv);
              dst[oi + 1] = Math.min(255, dst[oi + 1] + sv);
              dst[oi + 2] = Math.min(255, dst[oi + 2] + sv);
            }
          }
        }
      }

      visCtx.putImageData(out, 0, 0);
    } catch {
      // CORS or security error → blur fallback
      visCvs.style.display = "none";
      badge.style.backdropFilter = "blur(6px)";
      badge.style.setProperty("-webkit-backdrop-filter", "blur(6px)");
      running = false;
    }
  }

  requestAnimationFrame(render);
  return () => { running = false; visCvs.remove(); };
}

/* ── Hook ─────────────────────────────────────────────────────────── */

let nextId = 0;

export function useLiquidGlass(
  ref: RefObject<HTMLElement | null>,
  opts: LiquidGlassOptions = {},
) {
  const idRef = useRef(`lg-${++nextId}`);
  const cleanupRef = useRef<(() => void) | null>(null);

  const {
    ior = 1.5, scale = 80, specular = 0.35,
    lightAngle = 225, lightIntensity = 2.2, bevelWidth = 1,
    frost = 0, tint = 0.03, borderOpacity = 0.15,
  } = opts;

  useEffect(() => {
    const badge = ref.current;
    if (!badge) return;

    const id = idRef.current;

    const raf = requestAnimationFrame(() => {
      const { width: elW, height: elH } = badge.getBoundingClientRect();
      const w = Math.round(elW), h = Math.round(elH);
      if (!w || !h) return;

      const pad = Math.ceil(scale * 0.6);
      const tw = w + pad * 2, th = h + pad * 2;

      const disp = generateDisplacementMap(w, h, pad, ior, bevelWidth);
      const spec = specular > 0
        ? generateSpecularMap(w, h, pad, lightAngle, lightIntensity, bevelWidth)
        : null;

      // Apply CSS styling
      badge.style.backgroundColor = `rgba(255,255,255,${tint})`;
      badge.style.borderColor = `rgba(255,255,255,${borderOpacity})`;

      // Chrome/Chromium → SVG backdrop-filter (feImage+data URL works)
      // Firefox/Safari  → canvas with JS pixel displacement
      const isChromium = /Chrome\//.test(navigator.userAgent);

      if (isChromium) {
        cleanupRef.current = setupChromeRenderer(
          badge, id, pad, tw, th, scale, frost, specular,
          disp.url, spec?.url ?? null,
        );
      } else {
        cleanupRef.current = setupCanvasRenderer(
          badge, pad, tw, th, scale, frost, specular,
          disp.pixels, spec?.pixels ?? null,
        );
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      cleanupRef.current?.();
      cleanupRef.current = null;
      const b = ref.current;
      if (b) { b.style.backgroundColor = ""; b.style.borderColor = ""; }
    };
  }, [ref, ior, scale, specular, lightAngle, lightIntensity, bevelWidth, frost, tint, borderOpacity]);
}
