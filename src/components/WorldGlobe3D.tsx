"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoCentroid, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, MultiLineString, MultiPolygon, Polygon } from "geojson";
import type { Topology, GeometryCollection, GeometryObject } from "topojson-specification";

export interface WorldGlobe3DProps {
  countries: { name: string; code: string | null; pct: number }[];
  currentIndex: number;
  className?: string;
}

// ISO 3166-1 alpha-3 -> numeric (string, kept zero-padded for clarity)
const ISO3_TO_NUMERIC: Record<string, string> = {
  ARG: "032",
  MEX: "484",
  ESP: "724",
  COL: "170",
  CHL: "152",
};

type CountryFeature = Feature<Polygon | MultiPolygon, Record<string, unknown>>;

const TOPOLOGY_URL = "/world-atlas-110m.json";
const IDLE_DEG_PER_SEC = 6;
// Critically-damped spring (k=12, c=2·√12≈6.93). Fast settle, no overshoot.
const SPRING_STIFFNESS = 12;
const SPRING_DAMPING = 7;
const IDLE_SETTLE_RATE = 6;

// Pick the shortest angular path between two longitudes for a tween.
function shortestLonTarget(from: number, to: number): number {
  let delta = to - from;
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  return from + delta;
}

export default function WorldGlobe3D({ countries, currentIndex, className }: WorldGlobe3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<number>(0);
  const [countryFeatures, setCountryFeatures] = useState<CountryFeature[] | null>(null);

  // Rotation state held in a ref so the rAF loop doesn't trigger re-renders for the spin.
  const rotationRef = useRef<[number, number]>([0, -10]);
  const velocityRef = useRef<[number, number]>([IDLE_DEG_PER_SEC, 0]);
  const [, setTick] = useState(0);

  // Focus state — the target country to face. While focused, the spring pulls
  // rotation toward this point; the target itself drifts at IDLE_DEG_PER_SEC so
  // momentum is preserved through the cycle (no hard stop at country center).
  const focusRef = useRef<{ startLon: number; startLat: number; startTime: number } | null>(null);

  const lastFrameRef = useRef<number | null>(null);

  // Load topology once.
  useEffect(() => {
    let cancelled = false;
    fetch(TOPOLOGY_URL)
      .then((r) => r.json() as Promise<Topology<{ countries: GeometryCollection<Record<string, unknown>> }>>)
      .then((topology) => {
        if (cancelled) return;
        const collection = feature(
          topology,
          topology.objects.countries as unknown as GeometryObject,
        ) as unknown as FeatureCollection<Polygon | MultiPolygon, Record<string, unknown>>;
        setCountryFeatures(collection.features);
      })
      .catch(() => {
        // Silently fail; component will simply render an empty sphere.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Resize observer to make the SVG square and fill its container.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const next = Math.max(0, Math.floor(Math.min(width, height)));
        setSize((prev) => (prev === next ? prev : next));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Build a quick lookup: numeric id (as string, no padding) -> feature
  const featuresById = useMemo(() => {
    const map = new Map<string, CountryFeature>();
    if (!countryFeatures) return map;
    for (const f of countryFeatures) {
      if (f.id !== undefined && f.id !== null) {
        map.set(String(f.id), f);
        // Also store zero-padded form for safety.
        map.set(String(f.id).padStart(3, "0"), f);
      }
    }
    return map;
  }, [countryFeatures]);

  // Resolve the current target country -> centroid.
  const targetCountry = countries[currentIndex];
  const targetCode = targetCountry?.code ?? null;

  // Update focus target whenever currentIndex changes. If no code, drop focus
  // and let the rotation settle back to pure idle drift.
  useEffect(() => {
    if (!targetCode) {
      focusRef.current = null;
      return;
    }
    const numeric = ISO3_TO_NUMERIC[targetCode];
    if (!numeric) {
      focusRef.current = null;
      return;
    }
    const f = featuresById.get(numeric) ?? featuresById.get(String(parseInt(numeric, 10)));
    if (!f) return;
    const [lon, lat] = geoCentroid(f);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return;

    // Target lon: the position that puts the centroid at the front of the globe.
    // Use the shortest angular path from current rotation so the spring takes the
    // nearest route. Target lat is fixed at the centroid for the whole focus.
    const startLon = shortestLonTarget(rotationRef.current[0], -lon);
    focusRef.current = {
      startLon,
      startLat: -lat,
      startTime: performance.now(),
    };
  }, [targetCode, currentIndex, featuresById]);

  // Single rAF loop using a critically-damped spring. While focused, the target
  // drifts at IDLE_DEG_PER_SEC so the country passes through the front rather
  // than locking in place — momentum is preserved. While idle, velocity smoothly
  // converges to the idle drift speed.
  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      const last = lastFrameRef.current ?? now;
      const dt = Math.min(1 / 30, (now - last) / 1000); // clamp dt to avoid jumps
      lastFrameRef.current = now;

      const focus = focusRef.current;
      const [lon, lat] = rotationRef.current;
      let [vLon, vLat] = velocityRef.current;

      if (focus) {
        // Fixed target — spring eases to centroid and settles there so the
        // country actually sits centered before the next focus comes in.
        const tLon = focus.startLon;
        const tLat = focus.startLat;

        const accLon = SPRING_STIFFNESS * (tLon - lon) - SPRING_DAMPING * vLon;
        const accLat = SPRING_STIFFNESS * (tLat - lat) - SPRING_DAMPING * vLat;
        vLon += accLon * dt;
        vLat += accLat * dt;
      } else {
        // Idle: ease velocity toward (IDLE_DEG_PER_SEC, 0). Lat is left alone —
        // it drifts at whatever it had, slowly settling to 0.
        vLon += (IDLE_DEG_PER_SEC - vLon) * IDLE_SETTLE_RATE * dt;
        vLat += (0 - vLat) * IDLE_SETTLE_RATE * dt;
      }

      rotationRef.current = [lon + vLon * dt, lat + vLat * dt];
      velocityRef.current = [vLon, vLat];

      setTick((n) => (n + 1) % 1_000_000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lastFrameRef.current = null;
    };
  }, []);

  // Build projection + path for the current frame.
  const { spherePath, graticulePath, countriesPath, highlightPath } = useMemo(() => {
    if (size <= 0) {
      return { spherePath: "", graticulePath: "", countriesPath: "", highlightPath: "" };
    }
    const radius = size / 2 - 1;
    const projection = geoOrthographic()
      .scale(radius)
      .translate([size / 2, size / 2])
      .clipAngle(90)
      .rotate([rotationRef.current[0], rotationRef.current[1], 0]);
    const path = geoPath(projection);

    const sphere = path({ type: "Sphere" }) ?? "";
    const graticule = path(geoGraticule10() as MultiLineString) ?? "";

    let countriesD = "";
    let highlightD = "";

    if (countryFeatures) {
      const targetNumeric = targetCode ? ISO3_TO_NUMERIC[targetCode] : undefined;
      const targetIdSet = new Set<string>();
      if (targetNumeric) {
        targetIdSet.add(targetNumeric);
        targetIdSet.add(String(parseInt(targetNumeric, 10)));
      }

      const parts: string[] = [];
      const highlightParts: string[] = [];
      for (const f of countryFeatures) {
        const d = path(f);
        if (!d) continue;
        const idStr = f.id !== undefined && f.id !== null ? String(f.id) : "";
        if (idStr && targetIdSet.has(idStr)) {
          highlightParts.push(d);
        } else {
          parts.push(d);
        }
      }
      countriesD = parts.join(" ");
      highlightD = highlightParts.join(" ");
    }

    return {
      spherePath: sphere,
      graticulePath: graticule,
      countriesPath: countriesD,
      highlightPath: highlightD,
    };
    // We intentionally include the rotation tick via setTick re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, countryFeatures, targetCode, rotationRef.current[0], rotationRef.current[1]]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {size > 0 && (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label="Rotating wireframe globe"
          style={{ color: "currentColor", overflow: "visible" }}
        >
          {/* Sphere outline */}
          <path
            d={spherePath}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.25}
            strokeOpacity={0.9}
            vectorEffect="non-scaling-stroke"
          />
          {/* Graticule */}
          <path
            d={graticulePath}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeOpacity={0.25}
            vectorEffect="non-scaling-stroke"
          />
          {/* Country outlines (non-highlighted) */}
          {countriesPath && (
            <path
              d={countriesPath}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              strokeOpacity={0.55}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
          {/* Highlighted country — solid fill */}
          {highlightPath && (
            <path
              d={highlightPath}
              fill="currentColor"
              fillOpacity={1}
              stroke="currentColor"
              strokeWidth={2}
              strokeOpacity={1}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      )}
    </div>
  );
}
