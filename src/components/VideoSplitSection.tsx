"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
} from "react";
import { motion, useInView } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Users } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import {
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  XIcon,
} from "./platform-icons";
import WorldGlobe3D from "./WorldGlobe3D";

const easeOut = [0.16, 1, 0.3, 1] as const;
const EASING = "cubic-bezier(0.23, 1, 0.32, 1)";
const NUMBER_TIMING = { duration: 1800, easing: EASING };

const OPENING_WORDS = ["Construimos", "narrativas"];
const CLOSING_WORDS = ["que", "generan", "impacto", "real."];

/* ── Bento native dimensions ──────────────────────────────────────────────── */
const BENTO_W = 1843;
const ROW1_H = 349;
const ROW2_H = 360;
const ROW3_H = 267;
const GAP = 19;
const BENTO_H = ROW1_H + GAP + ROW2_H + GAP + ROW3_H;

/* ── Data ─────────────────────────────────────────────────────────────────── */

type Pais = { code: string | null; flag: string; name: string; pct: number };
const PAISES: Pais[] = [
  { code: "ARG",  flag: "🇦🇷", name: "Argentina", pct: 45 },
  { code: "MEX",  flag: "🇲🇽", name: "México",    pct: 20 },
  { code: "ESP",  flag: "🇪🇸", name: "España",    pct: 12 },
  { code: "COL",  flag: "🇨🇴", name: "Colombia",  pct: 8  },
  { code: "CHL",  flag: "🇨🇱", name: "Chile",     pct: 7  },
  { code: null,   flag: "🌎", name: "Otros",     pct: 8  },
];

type Proyecto = {
  rank: number;
  name: string;
  category: string;
  followers: string;
};
const PROYECTOS: Proyecto[] = [
  { rank: 1, name: "Cero Miligramos", category: "Salud Mental", followers: "587K" },
  { rank: 2, name: "En Teoría",       category: "Ciencia",      followers: "390K" },
  { rank: 3, name: "Criemos Libres",  category: "Crianza",      followers: "222K" },
  { rank: 4, name: "Darin Cocina",    category: "Humor",        followers: "139K" },
];

const TEMATICAS = [
  "🧠 Salud Mental",
  "👶 Crianza",
  "🔬 Ciencia",
  "💰 Finanzas",
  "😂 Humor",
  "✨ Lifestyle",
  "📰 Periodismo",
  "💪 Fitness",
  "🚀 Emprendimiento",
];

const ECOSISTEMA_STATS = [
  { value: "72", label: "Cuentas activas" },
  { value: "20", label: "Medios propios"  },
  { value: "29", label: "Creadores"       },
  { value: "5",  label: "Plataformas"     },
  { value: "9",  label: "Nichos"          },
];

// Used for inline-style color animation (motion.div animates these via rgba lerp).
// Two sets — light keeps the slideshow's high-contrast scaling (dark text on
// less-saturated cards); dark keeps text white on every rank because the
// low-alpha violets get composited against a dark page bg and would otherwise
// produce dark text on a near-black surface.
type RankPalette = { bg: string; text: string; muted: string };

const PROJECT_RANK_COLORS_LIGHT: RankPalette[] = [
  { bg: "rgba(134, 80, 252, 1)",     text: "rgba(255, 255, 255, 1)",  muted: "rgba(255, 255, 255, 0.7)"  },
  { bg: "rgba(134, 80, 252, 0.78)",  text: "rgba(255, 255, 255, 1)",  muted: "rgba(255, 255, 255, 0.65)" },
  { bg: "rgba(134, 80, 252, 0.5)",   text: "rgba(20, 20, 20, 0.95)",  muted: "rgba(20, 20, 20, 0.6)"     },
  { bg: "rgba(134, 80, 252, 0.22)",  text: "rgba(20, 20, 20, 0.95)",  muted: "rgba(20, 20, 20, 0.55)"    },
];

const PROJECT_RANK_COLORS_DARK: RankPalette[] = [
  { bg: "rgba(134, 80, 252, 1)",     text: "rgba(255, 255, 255, 1)",    muted: "rgba(255, 255, 255, 0.7)"  },
  { bg: "rgba(134, 80, 252, 0.85)",  text: "rgba(255, 255, 255, 1)",    muted: "rgba(255, 255, 255, 0.7)"  },
  { bg: "rgba(134, 80, 252, 0.65)",  text: "rgba(255, 255, 255, 0.95)", muted: "rgba(255, 255, 255, 0.6)"  },
  { bg: "rgba(134, 80, 252, 0.42)",  text: "rgba(255, 255, 255, 0.9)",  muted: "rgba(255, 255, 255, 0.55)" },
];

/* ── Cycle controller for passive shimmer (one cell at a time) ────────────── */

const PASSIVE_CELLS = [
  "alcance",
  "split",
  "creadores",
  "proyectosCount",
  "youtube",
] as const;
type PassiveId = (typeof PASSIVE_CELLS)[number];

function usePassiveCycle(active: boolean, intervalMs = 3000): PassiveId {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % PASSIVE_CELLS.length),
      intervalMs,
    );
    return () => clearInterval(t);
  }, [active, intervalMs]);
  return PASSIVE_CELLS[idx];
}

/* ── Globe rotation cycle ─────────────────────────────────────────────────── */

/* ── Dark-mode detector — observes the .dark class on <html> ──────────────── */

function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const mo = new MutationObserver(update);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return isDark;
}

function usePaisCycle(active: boolean, intervalMs = 2400): number {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % PAISES.length),
      intervalMs,
    );
    return () => clearInterval(t);
  }, [active, intervalMs]);
  return idx;
}

function useEcosistemaCycle(active: boolean, intervalMs = 2200): number {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % ECOSISTEMA_STATS.length),
      intervalMs,
    );
    return () => clearInterval(t);
  }, [active, intervalMs]);
  return idx;
}

/* ── BentoCard ────────────────────────────────────────────────────────────── */

const bentoCardVariants = cva(
  "rounded-[30px] overflow-hidden relative shrink-0",
  {
    variants: {
      variant: {
        white: "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.07)]",
        soft: "bg-violet-light border border-violet-border/50",
        purple: "bg-[linear-gradient(145deg,#8650FC,#a47afc)]",
        "purple-mid": "bg-[linear-gradient(145deg,#7c3aed,#9b60f4)]",
      },
    },
    defaultVariants: { variant: "soft" },
  },
);

interface BentoCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoCardVariants> {}

const BentoCard = forwardRef<HTMLDivElement, BentoCardProps>(
  ({ children, variant, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(bentoCardVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  ),
);
BentoCard.displayName = "BentoCard";

/* ── Passive shimmer (subtle sweep) ───────────────────────────────────────── */

function PassiveShimmer({
  active,
  tone = "light",
}: {
  active: boolean;
  tone?: "light" | "dark";
}) {
  const gradient =
    tone === "dark"
      ? "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.10) 50%, transparent 65%)"
      : "linear-gradient(115deg, transparent 35%, rgba(134,80,252,0.10) 50%, transparent 65%)";

  return (
    <motion.div
      key={active ? "on" : "off"}
      className="absolute inset-0 pointer-events-none"
      style={{
        background: gradient,
        backgroundSize: "300% 100%",
        backgroundPosition: "150% 0%",
      }}
      animate={
        active
          ? { backgroundPosition: ["150% 0%", "-150% 0%"] }
          : { backgroundPosition: "150% 0%" }
      }
      transition={{ duration: 2, ease: "easeInOut" }}
      aria-hidden
    />
  );
}

/* ── Typography primitives ────────────────────────────────────────────────── */

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Absolute black/40 instead of text-foreground/40 — these labels live
        // on white-variant cards which stay literally white in dark mode, so
        // theme-adaptive foreground would invert and become invisible.
        "font-medium uppercase tracking-[0.05em] text-[18px] text-black/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

function BigNumber({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // text-[#1b1b1b] (slideshow ink color) — same reason as SectionLabel:
        // BigNumber sits on a literal white card by default. CellCreadores
        // overrides via className="text-white".
        "font-extrabold text-[#1b1b1b] leading-none tracking-[-4px] text-[96px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── PlatformPill ─────────────────────────────────────────────────────────── */

const PLATFORM_ICONS: Record<
  string,
  React.FC<{ size?: number; color?: string }>
> = {
  IG: InstagramIcon,
  TK: TikTokIcon,
  YT: YouTubeIcon,
  X: XIcon,
};

function PlatformPill({ label }: { label: string }) {
  const Icon = PLATFORM_ICONS[label];
  return (
    <div
      className={cn(
        "text-violet",
        "bg-violet-light border border-violet-border/40",
        "rounded-[20px] px-[12px] py-[8px]",
        "flex items-center justify-center",
      )}
    >
      {Icon ? (
        <Icon size={18} color="#8650FC" />
      ) : (
        <span className="text-[14px] font-semibold">{label}</span>
      )}
    </div>
  );
}

/* ── ThemePill ────────────────────────────────────────────────────────────── */

function ThemePill({ label, size = "md" }: { label: string; size?: "sm" | "md" }) {
  return (
    <div
      className={cn(
        "shrink-0 whitespace-nowrap",
        "bg-violet-light border border-violet-border/40",
        "rounded-full font-semibold text-violet tracking-[-0.5px]",
        size === "md"
          ? "px-[42px] py-[22px] text-[40px]"
          : "px-[22px] py-[12px] text-[20px]",
      )}
    >
      {label}
    </div>
  );
}

/* ── AnimatedNumber ───────────────────────────────────────────────────────── */

function AnimatedNumber({
  value,
  active,
  prefix,
  suffix,
  decimals,
}: {
  value: number;
  active: boolean;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <NumberFlow
      value={active ? value : 0}
      prefix={prefix}
      suffix={suffix}
      format={
        decimals != null
          ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals }
          : undefined
      }
      transformTiming={NUMBER_TIMING}
      spinTiming={NUMBER_TIMING}
      opacityTiming={NUMBER_TIMING}
    />
  );
}

/* ── ScrambleText ─────────────────────────────────────────────────────────── */

const SCRAMBLE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function ScrambleText({
  text,
  duration = 600,
}: {
  text: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(text);
  const prevRef = useRef(text);

  useEffect(() => {
    const from = prevRef.current;
    const to = text;
    if (from === to) return;

    const start = performance.now();
    const maxLen = Math.max(from.length, to.length);
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);

      let result = "";
      for (let i = 0; i < maxLen; i++) {
        // Each char unlocks at a slightly later time → wave reveal
        const charStart = (i / maxLen) * 0.55;
        const charEnd = charStart + 0.45;
        const cp = (progress - charStart) / (charEnd - charStart);

        if (cp >= 1) {
          result += to[i] ?? "";
        } else if (cp <= 0) {
          result += from[i] ?? " ";
        } else {
          // Mix random scramble + flicker between from/to chars
          if (Math.random() < 0.6) {
            result += SCRAMBLE_CHARSET[Math.floor(Math.random() * SCRAMBLE_CHARSET.length)];
          } else {
            result += Math.random() < 0.5 ? (from[i] ?? "") : (to[i] ?? "");
          }
        }
      }

      setDisplay(result);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevRef.current = to;
        setDisplay(to);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration]);

  return <>{display}</>;
}

/* ── ScrambleFlag ─────────────────────────────────────────────────────────── */

const FLAG_POOL = ["🇦🇷", "🇲🇽", "🇪🇸", "🇨🇴", "🇨🇱", "🌎", "🇧🇷", "🇺🇾", "🇵🇪"];

function ScrambleFlag({
  flag,
  duration = 450,
}: {
  flag: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(flag);
  const prevRef = useRef(flag);

  useEffect(() => {
    if (prevRef.current === flag) return;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      if (progress >= 1) {
        setDisplay(flag);
        prevRef.current = flag;
        return;
      }
      // Cycle through random flags ~12 fps then settle
      if (progress > 0.75) {
        setDisplay(flag);
      } else if (Math.floor(now / 80) % 2 === 0) {
        setDisplay(FLAG_POOL[Math.floor(Math.random() * FLAG_POOL.length)]);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [flag, duration]);

  return <>{display}</>;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  DESKTOP CELLS                                                             */
/* ────────────────────────────────────────────────────────────────────────── */

function CellAlcanceTotal({ active, passive }: { active: boolean; passive: boolean }) {
  return (
    <BentoCard
      variant="white"
      className="w-[481px] h-[349px] px-[48px] py-[44px] flex flex-col justify-between"
    >
      <SectionLabel>Alcance total combinado</SectionLabel>
      <div className="relative z-10">
        <BigNumber>
          <AnimatedNumber value={16.5} active={active} prefix="+" suffix="M" decimals={1} />
        </BigNumber>
        <div className="text-[22px] font-normal text-black/45 mt-[14px] tracking-[-0.3px] leading-[1.4]">
          Personas en la red
          <br />
          Zeratype
        </div>
      </div>
      <PassiveShimmer active={passive} />
    </BentoCard>
  );
}

function CellSplit({ active, passive }: { active: boolean; passive: boolean }) {
  return (
    <BentoCard variant="soft" className="w-[687px] h-[349px] flex">
      {/* Medios propios */}
      <div className="flex-1 px-[44px] py-[44px] flex flex-col justify-between border-r border-foreground/[0.06] relative">
        <div className="text-[16px] font-semibold text-foreground/45 tracking-[0.06em] uppercase">
          Medios propios
        </div>
        <div className="flex items-baseline flex-col gap-[10px]">
          <div className="text-[80px] font-extrabold text-foreground leading-none tracking-[-3px]">
            <AnimatedNumber value={1.6} active={active} suffix="M" decimals={1} />
          </div>
          <div className="text-[22px] font-medium text-foreground/55 tracking-[-0.2px]">
            seguidores
          </div>
        </div>
        <div className="flex gap-[8px]">
          {["IG", "TK", "YT", "X"].map((p) => (
            <PlatformPill key={p} label={p} />
          ))}
        </div>
      </div>

      {/* Creadores asociados */}
      <div className="flex-1 px-[44px] py-[44px] flex flex-col justify-between relative">
        <div className="text-[16px] font-semibold text-foreground/45 tracking-[0.06em] uppercase">
          Creadores asociados
        </div>
        <div className="flex items-baseline flex-col gap-[10px]">
          <div className="text-[80px] font-extrabold text-violet leading-none tracking-[-3px]">
            <AnimatedNumber value={14.9} active={active} suffix="M" decimals={1} />
          </div>
          <div
            className="text-[22px] font-medium text-violet tracking-[-0.2px]"
            style={{ opacity: 0.7 }}
          >
            seguidores
          </div>
        </div>
        <div className="text-[15px] font-semibold text-violet bg-violet-light border border-violet-border/40 rounded-[20px] px-[16px] py-[7px] inline-flex w-fit">
          90% del alcance total
        </div>
      </div>
      <PassiveShimmer active={passive} />
    </BentoCard>
  );
}

function CellCreadores({ active, passive }: { active: boolean; passive: boolean }) {
  const top = ["Sofi Martínez", "c0ker_", "Javi Ponzo", "Santi Talledo"];
  return (
    <BentoCard
      variant="purple"
      className="w-[636px] h-[349px] px-[52px] py-[44px] flex flex-col justify-between"
    >
      <Users color="rgba(255,255,255,0.6)" size={40} strokeWidth={1.3} />
      <div>
        <BigNumber className="text-white">
          <AnimatedNumber value={29} active={active} />
        </BigNumber>
        <div className="text-[24px] font-normal text-white/80 mt-[8px] tracking-[-0.3px]">
          Creadores únicos
        </div>
      </div>
      <div className="flex flex-wrap gap-[8px]">
        {top.map((name) => (
          <div
            key={name}
            className="text-[15px] font-medium text-white/90 bg-white/15 backdrop-blur-[4px] rounded-[20px] px-[16px] py-[6px]"
          >
            {name}
          </div>
        ))}
        <div className="text-[15px] font-medium text-white/55 bg-white/[0.08] rounded-[20px] px-[16px] py-[6px]">
          +25 más
        </div>
      </div>
      <PassiveShimmer active={passive} tone="dark" />
    </BentoCard>
  );
}

/* ── Países (with 3D globe) ───────────────────────────────────────────────── */

function CellPaises({ active }: { active: boolean }) {
  const idx = usePaisCycle(active);
  const current = PAISES[idx];

  return (
    <BentoCard
      variant="soft"
      className="w-[801px] h-[360px] relative"
    >
      {/* Globe — overflows the right & vertically; clipped by card's overflow-hidden */}
      <div
        className="absolute pointer-events-none aspect-square text-violet"
        style={{ height: "180%", top: "-40%", right: "-22%" }}
      >
        <WorldGlobe3D
          countries={PAISES}
          currentIndex={idx}
          className="w-full h-full"
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 px-[52px] py-[44px] w-[58%] h-full flex flex-col justify-between">
        <div className="text-[28px] font-semibold text-foreground tracking-[-0.5px] leading-[1.05]">
          Audiencia por país
        </div>

        <div>
          <div className="text-[104px] font-extrabold text-foreground leading-none tracking-[-4px] tabular-nums">
            <AnimatedNumber value={current.pct} active={active} suffix="%" />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[32px] leading-none">
              <ScrambleFlag flag={current.flag} />
            </span>
            <span className="text-[24px] font-medium text-foreground/60 tracking-[-0.3px] tabular-nums">
              <ScrambleText text={current.name} duration={500} />
            </span>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

/* ── Proyectos (infinite-loop scrollable carousel) ────────────────────────── */
//
// Triplication strategy:
//   Render 3 copies of the slides side by side: [P0..Pn-1, P0..Pn-1, P0..Pn-1].
//   Initialize scroll to the middle copy. On any scroll-end, if rawIdx fell
//   outside the middle [length, 2·length) window, instantly snap back into
//   the middle by ±length·width. The duplicates are visually identical so the
//   snap is invisible and gives the illusion of infinite scroll in both
//   directions for both auto-cycle and user scroll.
//
// Pause-on-user is keyed only on direct interaction (pointerdown/touchstart),
// NOT on `wheel`, so the page's vertical scroll never pauses the carousel.

function useInfiniteCarousel({
  length,
  active,
  intervalMs,
  scrollRef,
}: {
  length: number;
  active: boolean;
  intervalMs: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [idx, setIdx] = useState(0);
  const userScrollingRef = useRef(false);
  const userTimeoutRef = useRef<number | null>(null);
  const initRef = useRef(false);

  // Initialize scroll to the start of the middle set.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (initRef.current) return;

    let raf = 0;
    const init = () => {
      const w = el.clientWidth;
      if (w === 0) {
        raf = requestAnimationFrame(init);
        return;
      }
      el.scrollLeft = length * w;
      initRef.current = true;
    };
    init();
    return () => cancelAnimationFrame(raf);
  }, [length, scrollRef]);

  // Auto-cycle: scrollBy one slide. Smooth scroll into the next physical slot;
  // the normalizer snaps the position back into the middle set after settle.
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      if (userScrollingRef.current) return;
      const el = scrollRef.current;
      if (!el || !initRef.current) return;
      el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
    }, intervalMs);
    return () => clearInterval(t);
  }, [active, intervalMs, scrollRef]);

  // Track scroll to update visible idx + normalize position (debounced on
  // scroll-end so we don't fight in-flight smooth scrolls).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let normalizeTimer: number | null = null;

    const onScroll = () => {
      const w = el.clientWidth;
      if (w === 0) return;
      const rawIdx = Math.round(el.scrollLeft / w);
      const visible = ((rawIdx % length) + length) % length;
      setIdx(visible);

      if (normalizeTimer) clearTimeout(normalizeTimer);
      normalizeTimer = window.setTimeout(() => {
        const cw = el.clientWidth;
        if (cw === 0) return;
        const ri = Math.round(el.scrollLeft / cw);
        if (ri < length) {
          el.scrollLeft = (ri + length) * cw;
        } else if (ri >= 2 * length) {
          el.scrollLeft = (ri - length) * cw;
        }
      }, 220);
    };

    const markUser = () => {
      userScrollingRef.current = true;
      if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
      userTimeoutRef.current = window.setTimeout(() => {
        userScrollingRef.current = false;
      }, 1500);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", markUser);
    el.addEventListener("touchstart", markUser, { passive: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", markUser);
      el.removeEventListener("touchstart", markUser);
      if (normalizeTimer) clearTimeout(normalizeTimer);
      if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    };
  }, [length, scrollRef]);

  return idx;
}

function CellProyectos({ active }: { active: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDark = useIsDark();
  const idx = useInfiniteCarousel({
    length: PROYECTOS.length,
    active,
    intervalMs: 4500,
    scrollRef,
  });
  const palette = isDark ? PROJECT_RANK_COLORS_DARK : PROJECT_RANK_COLORS_LIGHT;
  const c = palette[idx];
  // Triplicated for invisible-snap infinite scroll
  const slides = [...PROYECTOS, ...PROYECTOS, ...PROYECTOS];

  return (
    <motion.div
      className="rounded-[30px] overflow-hidden relative shrink-0 w-[1022px] h-[360px]"
      animate={{ backgroundColor: c.bg }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* Title (top-left) + rank counter (top-right), overlay */}
      <div className="absolute top-[40px] left-[52px] right-[52px] z-10 pointer-events-none flex items-start justify-between">
        <motion.div
          className="text-[18px] font-semibold uppercase tracking-[0.06em]"
          animate={{ color: c.muted }}
          transition={{ duration: 0.7 }}
        >
          Proyectos top alcance
        </motion.div>
        <motion.div
          className="text-[64px] font-extrabold leading-none tracking-[-2px] tabular-nums"
          animate={{ color: c.text }}
          transition={{ duration: 0.7 }}
        >
          #{idx + 1}
        </motion.div>
      </div>

      {/* Scrollable track — one slide per project, triplicated */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((p, i) => (
          <div
            key={`${p.rank}-${i}`}
            className="snap-center w-full shrink-0 h-full px-[52px] pb-[44px] flex items-end justify-between gap-8"
          >
            <motion.div
              className="text-[88px] font-extrabold leading-[0.95] tracking-[-3.5px] max-w-[60%]"
              animate={{ color: c.text }}
              transition={{ duration: 0.7 }}
            >
              {p.name}
            </motion.div>
            <motion.div
              className="text-[88px] font-extrabold leading-[0.95] tracking-[-3.5px] tabular-nums"
              animate={{ color: c.text }}
              transition={{ duration: 0.7 }}
            >
              {p.followers}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Mobile proyectos carousel — auto-cycles single full-width slide ──────── */

function MobileProyectosCarousel({ active }: { active: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDark = useIsDark();
  const idx = useInfiniteCarousel({
    length: PROYECTOS.length,
    active,
    intervalMs: 4000,
    scrollRef,
  });
  const palette = isDark ? PROJECT_RANK_COLORS_DARK : PROJECT_RANK_COLORS_LIGHT;
  const c = palette[idx];
  const slides = [...PROYECTOS, ...PROYECTOS, ...PROYECTOS];

  return (
    <motion.div
      className="rounded-[20px] overflow-hidden relative h-[180px]"
      animate={{ backgroundColor: c.bg }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* Title + rank counter */}
      <div className="absolute top-4 left-5 right-5 z-10 pointer-events-none flex items-start justify-between">
        <motion.div
          className="text-[10px] font-semibold uppercase tracking-[0.06em]"
          animate={{ color: c.muted }}
          transition={{ duration: 0.7 }}
        >
          Proyectos top alcance
        </motion.div>
        <motion.div
          className="text-[34px] font-extrabold leading-none tracking-[-1px] tabular-nums"
          animate={{ color: c.text }}
          transition={{ duration: 0.7 }}
        >
          #{idx + 1}
        </motion.div>
      </div>

      {/* Scroll track — triplicated for infinite loop */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((p, i) => (
          <div
            key={`${p.rank}-${i}`}
            className="snap-center w-full shrink-0 h-full px-5 pb-5 flex items-end justify-between gap-4"
          >
            <motion.div
              className="text-[34px] font-extrabold leading-[0.95] tracking-[-1.5px] max-w-[58%]"
              animate={{ color: c.text }}
              transition={{ duration: 0.7 }}
            >
              {p.name}
            </motion.div>
            <motion.div
              className="text-[34px] font-extrabold leading-[0.95] tracking-[-1.5px] tabular-nums"
              animate={{ color: c.text }}
              transition={{ duration: 0.7 }}
            >
              {p.followers}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Row 3 ────────────────────────────────────────────────────────────────── */

function CellProyectosCount({ active, passive }: { active: boolean; passive: boolean }) {
  return (
    <BentoCard
      variant="purple-mid"
      className="w-[326px] h-[267px] px-[40px] py-[36px] flex flex-col justify-between"
    >
      <div className="text-[16px] font-semibold text-white/70 tracking-[0.06em] uppercase">
        Proyectos únicos
      </div>
      <div>
        <div className="text-[86px] font-extrabold text-white leading-none tracking-[-3px]">
          <AnimatedNumber value={20} active={active} />
        </div>
        <div className="text-[19px] font-normal text-white/75 mt-[8px] tracking-[-0.2px]">
          medios de contenido
        </div>
      </div>
      <PassiveShimmer active={passive} tone="dark" />
    </BentoCard>
  );
}

function CellYouTube({ active, passive }: { active: boolean; passive: boolean }) {
  return (
    <BentoCard
      variant="white"
      className="w-[360px] h-[267px] px-[40px] py-[36px] flex flex-col justify-between"
    >
      <div className="flex items-center gap-[10px]">
        <YouTubeIcon size={22} color="rgba(0,0,0,0.3)" />
        <span className="text-[16px] font-semibold text-black/30 tracking-[0.04em] uppercase">
          YouTube
        </span>
      </div>
      <div>
        <div className="text-[72px] font-extrabold text-[#1b1b1b] leading-none tracking-[-3px]">
          <AnimatedNumber value={1.66} active={active} prefix="+" suffix="M" decimals={2} />
        </div>
        <div className="text-[18px] font-normal text-black/45 mt-[10px] tracking-[-0.2px]">
          reproducciones totales
        </div>
      </div>
      <PassiveShimmer active={passive} />
    </BentoCard>
  );
}

/* ── Tematicas (carousel) ─────────────────────────────────────────────────── */

function CellTematicas() {
  return (
    <BentoCard
      variant="soft"
      className="w-[530px] h-[267px] py-[36px] flex flex-col gap-[20px]"
    >
      <div className="px-[44px] text-[22px] font-semibold text-foreground tracking-[-0.4px]">
        9 temáticas cubiertas
      </div>
      <div className="flex-1 flex items-center overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <motion.div
          className="flex gap-[8px] w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: { duration: 28, repeat: Infinity, repeatType: "loop", ease: "linear" },
          }}
        >
          {[...TEMATICAS, ...TEMATICAS].map((t, i) => (
            <ThemePill key={`${t}-${i}`} label={t} />
          ))}
        </motion.div>
      </div>
    </BentoCard>
  );
}

/* ── Ecosistema (cycling — section title top-left, label baseline-aligned ──── */
/*    with bottom of number on the right) ─────────────────────────────────── */

function CellEcosistema({ active }: { active: boolean }) {
  const idx = useEcosistemaCycle(active);
  const current = ECOSISTEMA_STATS[idx];

  return (
    <BentoCard
      variant="white"
      className="w-[570px] h-[267px] px-[40px] pt-[40px] relative"
    >
      <SectionLabel>El ecosistema en números</SectionLabel>

      {/* `last baseline` aligns the last-line baseline of the label with the
          number's baseline — pixel-aligned bottom regardless of 1↔2 line wrap.
          Negative `bottom` drops the empty descender area below the card edge
          (clipped by overflow-hidden) so the visible glyph bottom sits flush. */}
      <div
        className="absolute left-[40px] right-[40px] flex justify-between gap-6"
        style={{ alignItems: "last baseline", bottom: -14 }}
      >
        {/* Outer wrapper carries the mask + vertical padding so glyphs whose
            ascenders/descenders overflow the tight line-box don't get clipped
            by the mask (mask-image clips to the element's box). */}
        <div
          className="flex-1 min-w-0 py-2"
          style={{
            maskImage:
              "linear-gradient(to left, transparent 0%, black 4%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to left, transparent 0%, black 4%, black 100%)",
          }}
        >
          <div className="text-left text-[56px] font-extrabold text-[#1b1b1b] leading-[0.8] tracking-[-2px]">
            <ScrambleText text={current.label} duration={500} />
          </div>
        </div>
        <div className="text-[128px] font-extrabold text-[#1b1b1b] leading-[0.78] tracking-[-5px] tabular-nums">
          <AnimatedNumber value={Number(current.value)} active={active} />
        </div>
      </div>
    </BentoCard>
  );
}

/* ── Desktop bento grid ───────────────────────────────────────────────────── */

function BentoGrid({
  active,
  passive,
}: {
  active: boolean;
  passive: PassiveId;
}) {
  return (
    <div className="flex flex-col select-none" style={{ width: BENTO_W, gap: GAP }}>
      <div className="flex" style={{ height: ROW1_H, gap: GAP }}>
        <CellAlcanceTotal active={active} passive={passive === "alcance"} />
        <CellSplit         active={active} passive={passive === "split"} />
        <CellCreadores     active={active} passive={passive === "creadores"} />
      </div>

      <div className="flex" style={{ height: ROW2_H, gap: GAP }}>
        <CellPaises    active={active} />
        <CellProyectos active={active} />
      </div>

      <div className="flex" style={{ height: ROW3_H, gap: GAP }}>
        <CellProyectosCount active={active} passive={passive === "proyectosCount"} />
        <CellYouTube        active={active} passive={passive === "youtube"} />
        <CellTematicas />
        <CellEcosistema     active={active} />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  MOBILE LAYOUT                                                             */
/* ────────────────────────────────────────────────────────────────────────── */

function MobileBento({
  active,
  passive,
}: {
  active: boolean;
  passive: PassiveId;
}) {
  const idx = usePaisCycle(active);
  const current = PAISES[idx];
  const ecoIdx = useEcosistemaCycle(active);
  const ecoCurrent = ECOSISTEMA_STATS[ecoIdx];

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Alcance + Split (collapsed) */}
      <div className="grid grid-cols-2 gap-3">
        <BentoCard
          variant="white"
          className="col-span-2 p-6 h-[180px] flex flex-col justify-between"
        >
          <div className="text-[12px] font-medium uppercase tracking-[0.05em] text-black/40">
            Alcance total combinado
          </div>
          <div>
            <div className="text-[58px] font-extrabold text-[#1b1b1b] leading-none tracking-[-2px]">
              <AnimatedNumber value={16.5} active={active} prefix="+" suffix="M" decimals={1} />
            </div>
            <div className="text-[13px] font-normal text-black/45 mt-[8px] tracking-[-0.2px]">
              Personas en la red Zeratype
            </div>
          </div>
          <PassiveShimmer active={passive === "alcance"} />
        </BentoCard>

        <BentoCard variant="soft" className="p-5 h-[170px] flex flex-col justify-between">
          <div className="text-[10px] font-semibold text-foreground/45 tracking-[0.06em] uppercase">
            Medios propios
          </div>
          <div>
            <div className="text-[40px] font-extrabold text-foreground leading-none tracking-[-2px]">
              <AnimatedNumber value={1.6} active={active} suffix="M" decimals={1} />
            </div>
            <div className="text-[11px] text-foreground/55 mt-1">seguidores</div>
          </div>
          <PassiveShimmer active={passive === "split"} />
        </BentoCard>

        <BentoCard variant="soft" className="p-5 h-[170px] flex flex-col justify-between">
          <div className="text-[10px] font-semibold text-foreground/45 tracking-[0.06em] uppercase">
            Asociados
          </div>
          <div>
            <div className="text-[40px] font-extrabold text-violet leading-none tracking-[-2px]">
              <AnimatedNumber value={14.9} active={active} suffix="M" decimals={1} />
            </div>
            <div className="text-[11px] text-violet/70 mt-1">creadores</div>
          </div>
        </BentoCard>
      </div>

      {/* Creadores */}
      <BentoCard
        variant="purple"
        className="p-6 h-[200px] flex flex-col justify-between"
      >
        <Users color="rgba(255,255,255,0.6)" size={28} strokeWidth={1.3} />
        <div>
          <div className="text-[58px] font-extrabold text-white leading-none tracking-[-2px]">
            <AnimatedNumber value={29} active={active} />
          </div>
          <div className="text-[14px] font-normal text-white/80 mt-1">
            Creadores únicos
          </div>
        </div>
        <PassiveShimmer active={passive === "creadores"} tone="dark" />
      </BentoCard>

      {/* Países (globe) */}
      <BentoCard variant="soft" className="relative h-[280px]">
        {/* Globe — overflows; clipped by card */}
        <div
          className="absolute pointer-events-none aspect-square text-violet"
          style={{ height: "180%", top: "-40%", right: "-30%" }}
        >
          <WorldGlobe3D
            countries={PAISES}
            currentIndex={idx}
            className="w-full h-full"
          />
        </div>

        {/* Foreground content */}
        <div className="relative z-10 p-5 h-full flex flex-col justify-between">
          <div className="text-[18px] font-semibold text-foreground tracking-[-0.3px]">
            Audiencia por país
          </div>
          <div>
            <div className="text-[64px] font-extrabold text-foreground leading-none tracking-[-2px] tabular-nums">
              <AnimatedNumber value={current.pct} active={active} suffix="%" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[22px] leading-none">
                <ScrambleFlag flag={current.flag} />
              </span>
              <span className="text-[15px] font-medium text-foreground/60 tracking-[-0.2px]">
                <ScrambleText text={current.name} duration={500} />
              </span>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Proyectos top alcance (auto-cycle, single card visible) */}
      <MobileProyectosCarousel active={active} />

      {/* Proyectos count + YouTube */}
      <div className="grid grid-cols-2 gap-3">
        <BentoCard
          variant="purple-mid"
          className="p-5 h-[170px] flex flex-col justify-between"
        >
          <div className="text-[10px] font-semibold text-white/70 tracking-[0.06em] uppercase">
            Proyectos únicos
          </div>
          <div>
            <div className="text-[44px] font-extrabold text-white leading-none tracking-[-1.5px]">
              <AnimatedNumber value={20} active={active} />
            </div>
            <div className="text-[11px] font-normal text-white/75 mt-1">
              medios
            </div>
          </div>
          <PassiveShimmer active={passive === "proyectosCount"} tone="dark" />
        </BentoCard>

        <BentoCard
          variant="white"
          className="p-4 h-[170px] flex flex-col justify-between overflow-hidden"
        >
          <div className="flex items-center gap-1.5">
            <YouTubeIcon size={14} color="rgba(0,0,0,0.3)" />
            <span className="text-[10px] font-semibold text-black/30 tracking-[0.04em] uppercase">
              YouTube
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-[30px] font-extrabold text-[#1b1b1b] leading-none tracking-[-1.2px] tabular-nums whitespace-nowrap">
              <AnimatedNumber value={1.66} active={active} prefix="+" suffix="M" decimals={2} />
            </div>
            <div className="text-[10px] font-normal text-black/45 mt-1 truncate">
              reproducciones
            </div>
          </div>
          <PassiveShimmer active={passive === "youtube"} />
        </BentoCard>
      </div>

      {/* Tematicas carousel */}
      <BentoCard variant="soft" className="py-5 h-[140px] flex flex-col gap-3">
        <div className="px-5 text-[14px] font-semibold text-foreground tracking-[-0.3px]">
          9 temáticas cubiertas
        </div>
        <div className="flex-1 flex items-center overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]">
          <motion.div
            className="flex gap-[6px] w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: { duration: 28, repeat: Infinity, repeatType: "loop", ease: "linear" },
            }}
          >
            {[...TEMATICAS, ...TEMATICAS].map((t, i) => (
              <ThemePill key={`${t}-${i}`} label={t} size="sm" />
            ))}
          </motion.div>
        </div>
      </BentoCard>

      {/* Ecosistema */}
      <BentoCard variant="white" className="h-[170px] px-5 pt-6 relative">
        <div className="text-[12px] font-medium uppercase tracking-[0.05em] text-black/40">
          El ecosistema en números
        </div>
        <div
          className="absolute left-5 right-5 flex justify-between gap-3"
          style={{ alignItems: "last baseline", bottom: -8 }}
        >
          <div
            className="flex-1 min-w-0 py-1"
            style={{
              maskImage:
                "linear-gradient(to left, transparent 0%, black 4%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to left, transparent 0%, black 4%, black 100%)",
            }}
          >
            <div className="text-left text-[28px] font-extrabold text-[#1b1b1b] leading-[0.8] tracking-[-1px]">
              <ScrambleText text={ecoCurrent.label} duration={500} />
            </div>
          </div>
          <div className="text-[68px] font-extrabold text-[#1b1b1b] leading-[0.78] tracking-[-2.5px] tabular-nums">
            <AnimatedNumber value={Number(ecoCurrent.value)} active={active} />
          </div>
        </div>
      </BentoCard>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Section                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

export default function VideoSplitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [scale, setScale] = useState(0.5);
  const [active, setActive] = useState(false);
  const passive = usePassiveCycle(active);

  /* Auto-scale desktop bento to fit container */
  const updateScale = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const w = el.clientWidth;
    setScale(Math.min(1, w / BENTO_W));
  }, []);

  useEffect(() => {
    updateScale();
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScale]);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setActive(true), 300);
      return () => clearTimeout(t);
    }
  }, [inView]);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-[30px] lg:px-[60px] xl:px-[120px]">
        {/* Opening text */}
        <p className="select-none text-[36px] leading-[1.15] font-normal mb-8 md:text-[42px] md:mb-10 lg:text-[56px] lg:mb-14 xl:text-[64px]">
          {OPENING_WORDS.map((word, i) => (
            <motion.span
              key={word + i}
              className="inline-block mr-[0.22em]"
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: easeOut, delay: i * 0.09 }}
            >
              {word}
            </motion.span>
          ))}
        </p>

        {/* Mobile layout */}
        <motion.div
          className="md:hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }}
        >
          <MobileBento active={active} passive={passive} />
        </motion.div>

        {/* Desktop bento (scaled) */}
        <motion.div
          ref={wrapperRef}
          className="hidden md:block relative"
          style={{ height: BENTO_H * scale }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }}
        >
          <div
            className="absolute top-0 left-0"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <BentoGrid active={active} passive={passive} />
          </div>
        </motion.div>

        {/* Closing text */}
        <p className="select-none text-[36px] leading-[1.15] font-normal text-right mt-8 md:text-[42px] md:mt-10 lg:text-[56px] lg:mt-14 xl:text-[64px]">
          {CLOSING_WORDS.map((word, i) => (
            <motion.span
              key={word + i}
              className="inline-block mr-[0.22em] last:mr-0"
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: easeOut, delay: 0.6 + i * 0.1 }}
            >
              {word}
            </motion.span>
          ))}
        </p>
      </div>
    </section>
  );
}
