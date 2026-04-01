"use client";

import { useState, useEffect } from "react";
import Intro from "@/components/Intro";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoSplitSection from "@/components/VideoSplitSection";
import WorkSection from "@/components/WorkSection";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

// First hero video — preloaded so playback starts instantly
const FIRST_VIDEO_SRC = "https://assets.mixkit.co/videos/921/921-1080.mp4";

// Module-level flag: survives SPA navigation, resets on F5 / full reload
let introPlayed = false;

export default function Home() {
  const [skipIntro] = useState(introPlayed);
  const [introComplete, setIntroComplete] = useState(introPlayed);
  const [assetsReady, setAssetsReady] = useState(introPlayed);

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
      setTimeout(resolve, 10_000);
    });

    Promise.all([fontReady, firstVideoReady]).then(() => setAssetsReady(true));
  }, [skipIntro]);

  useEffect(() => {
    if (introComplete && !skipIntro) {
      introPlayed = true;
    }
  }, [introComplete, skipIntro]);

  if (skipIntro) {
    return (
      <>
        <SmoothScroll />
        <Navbar />
        <main>
          <HeroSection />
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
        onComplete={() => setIntroComplete(true)}
      />

      {introComplete && (
        <>
          <SmoothScroll />
          <Navbar />
          <main>
            <HeroSection />
            <VideoSplitSection />
            <WorkSection />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
