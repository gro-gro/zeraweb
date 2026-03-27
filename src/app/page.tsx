"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Intro from "@/components/Intro";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoSplitSection from "@/components/VideoSplitSection";
import WorkSection from "@/components/WorkSection";
import Footer from "@/components/Footer";

const ease = [0.4, 0, 0.2, 1] as const;

const lines = [
  { text: "Somos", weight: "font-extralight" },
  { text: "media",    weight: "font-bold" },
  { text: "builders", weight: "font-bold" },
] as const;

// First hero video — preloaded so playback starts instantly
const FIRST_VIDEO_SRC = "https://assets.mixkit.co/videos/921/921-1080.mp4";

// Module-level flag: survives SPA navigation, resets on F5 / full reload
let introPlayed = false;

export default function Home() {
  const [skipIntro] = useState(introPlayed);
  const [introComplete, setIntroComplete] = useState(introPlayed);
  const [showTitle, setShowTitle]         = useState(introPlayed);
  const [titleDone,  setTitleDone]        = useState(introPlayed);
  const [assetsReady, setAssetsReady]     = useState(introPlayed);

  // Preload critical assets: font + first hero video
  useEffect(() => {
    if (skipIntro) return;

    const fontReady = document.fonts.ready;

    const firstVideoReady = new Promise<void>((resolve) => {
      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.src = FIRST_VIDEO_SRC;
      video.addEventListener("canplaythrough", () => resolve(), { once: true });
      // Fallback: never block longer than 10s on slow connections
      setTimeout(resolve, 10_000);
    });

    Promise.all([fontReady, firstVideoReady]).then(() => setAssetsReady(true));
  }, [skipIntro]);

  useEffect(() => {
    if (!introComplete || skipIntro) return;
    introPlayed = true;
    const t = setTimeout(() => setTitleDone(true), 950);
    return () => clearTimeout(t);
  }, [introComplete, skipIntro]);

  if (skipIntro) {
    return (
      <>
        <Navbar />
        <main>
          <HeroSection titleVisible />
          <VideoSplitSection />
          <WorkSection />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Intro
        assetsReady={assetsReady}
        onTagline={() => setShowTitle(true)}
        onComplete={() => setIntroComplete(true)}
      />

      <AnimatePresence>
      {showTitle && !titleDone && (
        <motion.div
          key="somos-title"
          className="fixed inset-0 z-[60] pointer-events-none"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease }}
        >
          <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col px-[30px] pt-[calc(56px+30px)] lg:px-[60px] lg:pt-[calc(56px+48px)] xl:px-[120px]">
            <div className="flex flex-1 items-center -mt-[15%]">
              <motion.h1
                className="text-[60px] leading-[0.89] uppercase lg:text-[100px] xl:text-[130px]"
                initial={{ color: "#000000" }}
                animate={{ color: introComplete ? "#ffffff" : "#000000" }}
                transition={{ duration: 0.9, ease }}
              >
                {lines.map(({ text, weight }, i) => (
                  <motion.span
                    key={text}
                    className={`${weight} block`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.25 + i * 0.14, ease }}
                  >
                    {text}
                  </motion.span>
                ))}
              </motion.h1>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {introComplete && (
        <>
          <Navbar />
          <main>
            <HeroSection titleVisible={titleDone} />
            <VideoSplitSection />
            <WorkSection />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
