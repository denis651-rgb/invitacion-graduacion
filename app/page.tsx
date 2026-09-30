"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Map,
} from "lucide-react";

// Countdown target: Viernes 13 de Noviembre 2026, 16:00 (GMT-4 / Bolivia)
const EVENT_DATE = new Date("2026-11-13T16:00:00-04:00").getTime();

// Pre-calculated deterministic floating golden stardust particles
const GOLD_PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  left: `${(i * 3.1) % 96 + 2}%`,
  size: `${(i % 4) * 1.2 + 2.5}px`,
  duration: `${14 + (i % 7) * 2}s`,
  delay: `${(i * 0.7) % 12}s`,
  opacity: 0.35 + ((i % 5) * 0.12),
}));

function FloatingGoldParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {GOLD_PARTICLES.map((p) => (
        <span
          key={p.id}
          className="particula-dorada"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

// Retro Vintage Vinyl Record with Automatic Spin and Tonearm
function VintageVinyl({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 select-none">
      {/* Vinyl record disc */}
      <div
        className={`relative h-full w-full rounded-full bg-gradient-to-tr from-black via-zinc-950 to-black p-1 border-2 border-amber-300/70 transition-all shadow-xl ${
          isPlaying ? "animate-spin-slow shadow-amber-300/30" : "opacity-75"
        }`}
      >
        {/* Concentric vinyl groove rings */}
        <div className="absolute inset-1 rounded-full border border-zinc-700/30" />
        <div className="absolute inset-2 rounded-full border border-zinc-700/40" />
        <div className="absolute inset-3 rounded-full border border-zinc-800/60" />

        {/* Center retro label (vintage gold) */}
        <div className="absolute inset-0 m-auto h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 border border-amber-200 shadow-inner flex items-center justify-center">
          {/* Spindle hole */}
          <div className="h-1.5 w-1.5 rounded-full bg-black border border-amber-300" />
        </div>
      </div>

      {/* Tonearm / needle indicator */}
      <div
        className={`absolute -top-1 -right-0.5 h-6 w-6 pointer-events-none transition-transform duration-500 origin-top-right ${
          isPlaying ? "rotate-12" : "-rotate-30 opacity-60"
        }`}
      >
        <div className="h-4 w-0.5 bg-gradient-to-b from-amber-100 to-amber-400 rounded-full shadow" />
        <div className="h-1.5 w-1.5 -ml-0.5 rounded-full bg-amber-300 shadow-sm" />
      </div>
    </div>
  );
}

export default function GraduationInvitation() {
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isFinished: false,
  });
  const [copiedLink, setCopiedLink] = useState(false);

  // Preloader duration: 1.8 seconds for smooth entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Launch celebratory gold and turquoise confetti after preloader exits
      setTimeout(() => {
        launchConfetti();
      }, 600);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  // Trigger luxury confetti (turquoise, cyan, gold, pearl white)
  const launchConfetti = () => {
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.65 },
      colors: ["#14b8a6", "#06b6d4", "#2dd4bf", "#d4af37", "#fef08a", "#ffffff"],
    });
  };

  // Countdown timer calculation
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = EVENT_DATE - now;

      if (distance <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isFinished: true,
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isFinished: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Ambient gentle piano/chime synthesizer for luxury background music fallback
  const startAmbientMelody = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      synthCtxRef.current = ctx;

      const notes = [349.23, 440.0, 523.25, 587.33, 659.25, 783.99, 523.25, 440.0];
      let step = 0;

      const playNote = () => {
        if (!synthCtxRef.current || synthCtxRef.current.state === "closed") return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 2.5);
        step++;
      };

      playNote();
      synthIntervalRef.current = setInterval(playNote, 1200);
    } catch {
      // AudioContext not allowed or not supported
    }
  }, []);

  const stopAmbientMelody = useCallback(() => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (synthCtxRef.current) {
      synthCtxRef.current.close().catch(() => {});
      synthCtxRef.current = null;
    }
  }, []);

  // Pause music immediately (silence) without needing manual pause
  const pauseMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopAmbientMelody();
    setIsPlaying(false);
  }, [stopAmbientMelody]);

  const playMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay waiting for user gesture
        });
    }
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        playMusic();
      } else {
        pauseMusic();
      }
    }
  };

  // ========================================================
  // AUTOMATIC PLAYBACK & AUTO-SILENCE ON LEAVING
  // ========================================================
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.7;

    const onPlayEvent = () => setIsPlaying(true);
    const onPauseEvent = () => setIsPlaying(false);

    audio.addEventListener("play", onPlayEvent);
    audio.addEventListener("pause", onPauseEvent);

    const tryAutoPlay = () => {
      if (audio && audio.paused) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              // Autoplay policy: will trigger on first user interaction
            });
        }
      }
    };

    // Attempt automatic playback immediately on mount
    tryAutoPlay();

    // Also trigger as soon as browser has enough data or can play
    audio.addEventListener("canplay", tryAutoPlay, { once: true });
    audio.addEventListener("loadeddata", tryAutoPlay, { once: true });

    // Universal gesture fallback to satisfy browser security policies
    // If the browser blocks 0-click autoplay, starts immediately on first interaction (touch, click, scroll)
    const interactionEvents = ["pointerdown", "touchstart", "click", "scroll", "keydown"];
    const handleFirstInteraction = () => {
      tryAutoPlay();
      cleanupInteractionListeners();
    };

    const cleanupInteractionListeners = () => {
      interactionEvents.forEach((ev) => {
        window.removeEventListener(ev, handleFirstInteraction);
      });
    };

    interactionEvents.forEach((ev) => {
      window.addEventListener(ev, handleFirstInteraction, { once: true, passive: true });
    });

    // Auto-silence when tab is hidden, minimized, or when user navigates away
    const handleVisibilityChange = () => {
      if (document.hidden && audio) {
        audio.pause();
      }
    };

    const handlePageLeave = () => {
      if (audio) {
        audio.pause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageLeave);
    window.addEventListener("beforeunload", handlePageLeave);

    return () => {
      audio.removeEventListener("play", onPlayEvent);
      audio.removeEventListener("pause", onPauseEvent);
      audio.removeEventListener("canplay", tryAutoPlay);
      audio.removeEventListener("loadeddata", tryAutoPlay);
      cleanupInteractionListeners();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageLeave);
      window.removeEventListener("beforeunload", handlePageLeave);
    };
  }, []);

  // WhatsApp pre-filled text
  const whatsappUrl =
    "https://wa.me/59163428669?text=" +
    encodeURIComponent("¡Hola Jose! Confirmo mi asistencia a tu graduación. Felicidades.");

  // WhatsApp RSVP Handler with Festive Gold & Green Confetti Explosion before redirecting
  const handleRsvpWithConfetti = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    // Palette: Gold, Emerald, Light Gold, Mint
    const festiveColors = ["#d4af37", "#fef08a", "#10b981", "#059669", "#34d399", "#fcf6ba"];

    // Central blast
    confetti({
      particleCount: 85,
      spread: 80,
      origin: { y: 0.65 },
      colors: festiveColors,
    });

    // Left cannon burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: festiveColors,
    });

    // Right cannon burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: festiveColors,
    });

    setIsRedirecting(true);

    // Silence music when leaving to WhatsApp
    pauseMusic();

    // Give the guest time to enjoy the celebration before opening WhatsApp
    setTimeout(() => {
      setIsRedirecting(false);
      window.open(whatsappUrl, "_blank");
    }, 850);
  };

  const copyPageUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const calendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Graduaci%C3%B3n+de+Jose+Ronaldo+Ortiz+Garnica&dates=20261113T200000Z/20261114T040000Z&details=Celebraci%C3%B3n+de+Graduaci%C3%B3n+-+Lic.+en+Administraci%C3%B3n+de+Empresas&location=Facultad+Integral+Ichilo";

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#011619] via-[#022e34] to-[#011619] text-teal-50 selection:bg-teal-500 selection:text-white">
      {/* Audio Element for custom track in public/musica.mpeg */}
      <audio
        ref={audioRef}
        autoPlay
        playsInline
        loop
        preload="auto"
        src="/musica.mpeg"
      >
        <source src="/musica.mpeg" type="audio/mpeg" />
        <source src="/musica.mpeg" type="video/mpeg" />
      </audio>

      {/* Floating Gold Particles in Background */}
      <FloatingGoldParticles />

      {/* ========================================================
          PANTALLA DE CARGA MINIMALISTA (Preloader)
      ======================================================== */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#011619]"
          >
            {/* Ambient center aura */}
            <div className="absolute h-80 w-80 rounded-full bg-teal-500/10 blur-[100px]" />
            <div className="absolute h-64 w-64 rounded-full bg-amber-500/10 blur-[90px]" />

            <div className="relative z-10 text-center">
              {/* Monogram crest */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.75, 1, 0.75] }}
                transition={{
                  scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                }}
                className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-amber-300/30 bg-teal-950/60 shadow-2xl backdrop-blur-md"
              >
                <span className="titulo-script texto-dorado text-5xl select-none">
                  JRO
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-6"
              >
                <p className="subtitulo-elegante text-amber-200/90 text-xs font-semibold tracking-[4px]">
                  Invitación de Graduación
                </p>
                <div className="mt-3 mx-auto h-[1px] w-16 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          DISCO ANTIGUO GIRATORIO FLOTANTE (Solo icono, sin letras)
      ======================================================== */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-40">
        <motion.button
          type="button"
          onClick={toggleMusic}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center rounded-full p-1 bg-[#011619]/80 backdrop-blur-md border border-amber-300/40 shadow-2xl hover:border-amber-300/80 transition-all cursor-pointer focus:outline-none"
          title={isPlaying ? "Pausar música" : "Reproducir música"}
          aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        >
          <VintageVinyl isPlaying={isPlaying} />
        </motion.button>
      </div>

      {/* Background Decorative Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-teal-500/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[32rem] w-[32rem] rounded-full bg-amber-500/10 blur-[150px]" />
        <div className="absolute bottom-10 left-1/4 h-[30rem] w-[30rem] rounded-full bg-cyan-500/15 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-14">
        {/* ========================================================
            1. HERO / PORTADA
        ======================================================== */}
        <section className="text-center">
          {/* Institution badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-teal-950/80 px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-amber-200 backdrop-blur-md"
          >
            <GraduationCap className="h-4 w-4 text-amber-300" />
            <span>Facultad Integral Ichilo</span>
          </motion.div>

          {/* Emotional Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6"
          >
            <span className="subtitulo-elegante text-teal-300/90 font-semibold block text-xs">
              Invitación de Honor
            </span>
            <div className="sombra-oro my-2">
              <h2 className="titulo-script texto-dorado text-6xl sm:text-8xl leading-none">
                ¡Me gradué!
              </h2>
            </div>
            <div className="sombra-oro mt-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                <span className="texto-dorado">
                  Jose Ronaldo Ortiz Garnica
                </span>
              </h1>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-300/60" />
              <p className="subtitulo-elegante text-xs sm:text-sm text-teal-200 font-semibold">
                Licenciatura en Administración de Empresas
              </p>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-300/60" />
            </div>
          </motion.div>

          {/* Photo reveal */}
          <motion.div
            initial={{ scale: 0.9, filter: "blur(10px)", opacity: 0 }}
            animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="relative mx-auto mt-8 w-72 h-80 sm:w-80 sm:h-96"
          >
            {/* Elegant turquoise and gold luxury frame */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-amber-400/40 via-teal-400/30 to-amber-300/40 blur-md" />
            <div className="relative h-full w-full overflow-hidden rounded-2xl border-2 border-amber-300/50 shadow-2xl bg-teal-950">
              <Image
                src="/graduado.jpg"
                alt="Jose Ronaldo Ortiz Garnica - Graduado"
                fill
                priority
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#022327]/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-0 right-0 text-center px-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-950/85 backdrop-blur-md border border-amber-300/40 px-3.5 py-1 text-xs font-semibold text-amber-200 shadow-md">
                  <GraduationCap className="h-3.5 w-3.5 text-amber-300" />
                  <span>Lic. Jose Ronaldo Ortiz G.</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Date Ribbon */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-teal-100"
          >
            <div className="flex items-center gap-2 rounded-xl bg-teal-900/50 border border-teal-700/40 px-4 py-2 backdrop-blur-md">
              <Calendar className="h-4 w-4 text-amber-300" />
              <span className="texto-dorado font-bold">Viernes, 13 de Noviembre</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-teal-900/50 border border-teal-700/40 px-4 py-2 backdrop-blur-md">
              <Clock className="h-4 w-4 text-amber-300" />
              <span className="texto-dorado font-bold">16:00 Hrs</span>
            </div>
          </motion.div>
        </section>

        {/* ========================================================
            2. CUENTA REGRESIVA (Countdown con Glassmorphism)
        ======================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="tarjeta-glass mt-12 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-3/4 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
          
          <div className="flex items-center justify-center gap-2 text-amber-300 text-xs sm:text-sm font-semibold tracking-wider uppercase">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="subtitulo-elegante text-xs">Tiempo para el gran momento</span>
            <Sparkles className="h-4 w-4 text-amber-300" />
          </div>

          <h3 className="subtitulo-elegante mt-2 text-xl sm:text-2xl font-bold text-white tracking-[4px]">
            Cuenta Regresiva
          </h3>

          {/* Time boxes */}
          <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { label: "Días", value: timeLeft.days },
              { label: "Horas", value: timeLeft.hours },
              { label: "Minutos", value: timeLeft.minutes },
              { label: "Segundos", value: timeLeft.seconds },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center justify-center rounded-2xl bg-[#012226]/80 border border-teal-600/30 p-3 sm:p-4 shadow-inner backdrop-blur-md"
              >
                <span suppressHydrationWarning className="texto-dorado text-2xl sm:text-4xl font-extrabold font-mono">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider text-teal-300/80 font-medium">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Add to Calendar button */}
          <div className="mt-6 flex justify-center">
            <motion.a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={pauseMusic}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-teal-900/60 px-4 py-2 text-xs font-semibold text-amber-100 hover:bg-teal-800/80 transition-colors shadow-sm"
            >
              <Calendar className="h-3.5 w-3.5 text-amber-300" />
              <span>Agendar en Google Calendar</span>
            </motion.a>
          </div>
        </motion.section>

        {/* ========================================================
            3. TEXTO DE INVITACIÓN / CARTA EMOTIVA (Glassmorphism & Tracking)
        ======================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="tarjeta-glass mt-14 rounded-3xl p-7 sm:p-12 md:p-14 border border-amber-300/40 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle gold decoration */}
          <div className="absolute top-4 right-4 text-amber-300/10 pointer-events-none">
            <GraduationCap className="h-28 w-28" />
          </div>

          <div className="relative z-10 text-center">
            <div className="sombra-oro flex items-center justify-center gap-2">
              <span className="titulo-script texto-dorado text-3xl sm:text-5xl block my-1">
                Un sueño cumplido, un camino compartido
              </span>
              <Sparkles className="h-5 w-5 text-amber-300 shrink-0" />
            </div>

            <h3 className="subtitulo-elegante text-lg sm:text-xl font-bold tracking-[3px] text-white mt-1">
              Mi Graduación Profesional
            </h3>

            <div className="subtitulo-elegante mt-2 inline-flex items-center justify-center gap-2 text-xs sm:text-sm tracking-[2.5px] text-amber-200">
              <GraduationCap className="h-4 w-4 text-amber-300" />
              <span>Licenciado en Administración de Empresas</span>
              <GraduationCap className="h-4 w-4 text-amber-300" />
            </div>

            <div className="my-7 mx-auto h-[1px] w-28 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

            {/* Main letter body with enhanced breathing room (padding & margins) */}
            <div className="space-y-6 sm:space-y-7 text-sm sm:text-base leading-relaxed sm:leading-loose text-teal-100/90 text-justify">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Con el corazón lleno de alegría, orgullo y profunda gratitud, tengo el honor de invitarte a compartir conmigo uno de los momentos más importantes de mi vida:
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Después de años de esfuerzo, sacrificio, dedicación y perseverancia, hoy celebro con orgullo la culminación de una etapa que marcó mi vida y el comienzo de nuevos sueños y desafíos.
              </motion.p>

              {/* Glassmorphism tarjetas de agradecimiento con hover micro-interactivo */}
              <div className="my-6 space-y-4">
                {/* 1. Dios */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="tarjeta-agradecimiento p-4 sm:p-5 text-left"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="rounded-xl bg-amber-400/20 p-2 text-amber-300 shrink-0 mt-0.5 border border-amber-300/30">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-teal-100">
                      <strong className="texto-dorado font-semibold block sm:inline sm:mr-1">
                        Agradezco primeramente a Dios,
                      </strong>
                      por iluminar mi camino, darme fortaleza y permitirme alcanzar esta meta.
                    </p>
                  </div>
                </motion.div>

                {/* 2. Padres */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="tarjeta-agradecimiento p-4 sm:p-5 text-left"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="rounded-xl bg-teal-500/20 p-2 text-teal-300 shrink-0 mt-0.5 border border-teal-400/30">
                      <Heart className="h-4 w-4" />
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-teal-100">
                      <strong className="texto-dorado font-semibold block sm:inline sm:mr-1">
                        A mis queridos padres,
                      </strong>
                      Carmelo Ortiz Saavedra y Cristina Garnica Copa, gracias por su amor incondicional, sus sacrificios, sus consejos y por creer siempre en mí. Este logro también es de ustedes.
                    </p>
                  </div>
                </motion.div>

                {/* 3. Pareja */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="tarjeta-agradecimiento p-4 sm:p-5 text-left"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="rounded-xl bg-rose-400/20 p-2 text-rose-300 shrink-0 mt-0.5 border border-rose-300/30">
                      <Heart className="h-4 w-4 fill-rose-300/50" />
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-teal-100">
                      <strong className="texto-dorado font-semibold block sm:inline sm:mr-1">
                        Y de manera muy especial a mi pareja,
                      </strong>
                      quien estuvo a mi lado durante este camino, compartiendo mis alegrías, apoyándome en los momentos difíciles y celebrando conmigo cada pequeño avance. Gracias por caminar a mi lado, por creer en mí y por ser parte importante de esta historia.{" "}
                      <span className="text-rose-200 font-medium inline-flex items-center gap-1">
                        Este logro también lleva un pedacito de ti.
                        <Heart className="h-3.5 w-3.5 text-rose-300 fill-rose-300/80 inline shrink-0" />
                      </span>
                    </p>
                  </div>
                </motion.div>

                {/* 4. Familiares y amigos */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="tarjeta-agradecimiento p-4 sm:p-5 text-left"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="rounded-xl bg-amber-400/20 p-2 text-amber-300 shrink-0 mt-0.5 border border-amber-300/30">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-teal-100">
                      <strong className="texto-dorado font-semibold block sm:inline sm:mr-1">
                        A mis hermanos, padrinos, familiares y amigos,
                      </strong>
                      gracias por acompañarme, motivarme y ser parte de este sueño que hoy se convierte en realidad.
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Hoy no celebro solamente un título; celebro años de esfuerzo, las personas que estuvieron a mi lado y el sueño que finalmente se hizo realidad.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-medium text-teal-50 pt-2"
              >
                Será un verdadero honor y una gran alegría contar con tu presencia para compartir juntos este día tan especial.
              </motion.p>
            </div>

            {/* Closing statement */}
            <div className="mt-10 pt-7 border-t border-teal-700/40 text-center">
              <p className="text-sm italic text-amber-200/90 font-serif">
                &ldquo;Con gratitud por el camino recorrido, orgullo por lo alcanzado y esperanza por todo lo que está por venir.&rdquo;
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <GraduationCap className="h-4 w-4 text-amber-300" />
                <span className="subtitulo-elegante text-sm font-bold text-white tracking-[3px]">
                  Licenciado en Administración de Empresas
                </span>
              </div>
              <p className="mt-1 text-xs text-teal-300/80">
                Un sueño cumplido, una nueva historia por comenzar.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ========================================================
            4. ITINERARIO & LUGARES
        ======================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mt-14"
        >
          <div className="text-center">
            <span className="subtitulo-elegante text-xs text-amber-300 font-semibold block">
              Programa del Evento
            </span>
            <h3 className="subtitulo-elegante mt-1 text-xl sm:text-2xl font-bold text-white tracking-[4px]">
              Itinerario & Lugares
            </h3>
            <p className="mt-1 text-sm text-teal-200/80">
              Acompáñame en cada momento de esta celebración
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {/* Tarjeta 1: Ceremonia Académica */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="tarjeta-glass rounded-3xl p-6 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-amber-400/20 p-3.5 border border-amber-300/40 text-amber-300 shrink-0">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-teal-800/60 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-200 uppercase mb-1">
                      Ceremonia Académica
                    </span>
                    <h4 className="text-lg font-bold text-white font-sans">
                      Predios de la Facultad Integral Ichilo
                    </h4>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-teal-200">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-amber-300" />
                        Hora de inicio: 16:00
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-300" />
                        Facultad Integral Ichilo
                      </span>
                    </div>
                  </div>
                </div>

                <motion.a
                  href="https://maps.app.goo.gl/WLUnF3STYNKyVgLn9?g_st=aw"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={pauseMusic}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2.5 text-xs font-bold text-teal-950 shadow-lg hover:from-amber-300 hover:to-amber-400 transition-all sm:self-center shrink-0 cursor-pointer"
                >
                  <Map className="h-4 w-4" />
                  <span>Ver en Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </motion.a>
              </div>
            </motion.div>

            {/* Tarjeta 2: Recepción / Fiesta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="tarjeta-glass rounded-3xl p-6 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-teal-500/20 p-3.5 border border-teal-400/40 text-teal-300 shrink-0">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-teal-800/60 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-200 uppercase mb-1">
                      Recepción & Fiesta
                    </span>
                    <h4 className="text-lg font-bold text-white font-sans">
                      Nuevo Horizonte Km-35
                    </h4>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-teal-200">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-amber-300" />
                        Hora de inicio: 19:30
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-300" />
                        Salón de Eventos Nuevo Horizonte Km-35
                      </span>
                    </div>
                  </div>
                </div>

                <motion.a
                  href="https://maps.app.goo.gl/jMyKMjixHyRTZHBa7?g_st=aw"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={pauseMusic}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2.5 text-xs font-bold text-teal-950 shadow-lg hover:from-amber-300 hover:to-amber-400 transition-all sm:self-center shrink-0 cursor-pointer"
                >
                  <Map className="h-4 w-4" />
                  <span>Ver en Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ========================================================
            5. CONFIRMACIÓN (RSVP) & WHATSAPP
        ======================================================== */}
        <motion.section
          id="rsvp"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="tarjeta-glass mt-14 rounded-3xl p-6 sm:p-10 text-center border-2 border-amber-300/40 shadow-2xl relative overflow-hidden"
        >
          {/* Top highlight glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-2/3 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/40 shadow-inner">
            <MessageCircle className="h-7 w-7 text-teal-300" />
          </div>

          <span className="subtitulo-elegante mt-3 block text-xs text-amber-300 font-semibold tracking-[3px]">
            Confirma tu presencia
          </span>
          <h3 className="subtitulo-elegante mt-1 text-xl sm:text-2xl font-bold text-white tracking-[4px]">
            Confirmación de Asistencia (RSVP)
          </h3>
          <p className="mt-2 text-sm text-teal-100/90 max-w-md mx-auto leading-relaxed">
            Tu presencia es el mejor regalo para celebrar este logro. Por favor confirma tu asistencia directamente por WhatsApp.
          </p>

          <div className="mt-8 flex justify-center">
            {/* WhatsApp button: Dispara explosión de confeti y silencia música antes de redirigir */}
            <motion.button
              type="button"
              onClick={handleRsvpWithConfetti}
              disabled={isRedirecting}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 px-8 py-4 text-base font-bold text-white shadow-xl hover:shadow-teal-500/30 transition-all border border-teal-300/40 cursor-pointer disabled:opacity-85"
            >
              {isRedirecting ? (
                <>
                  <Sparkles className="h-5 w-5 animate-spin text-amber-200" />
                  <span>¡Abriendo WhatsApp...!</span>
                </>
              ) : (
                <>
                  <MessageCircle className="h-5 w-5 fill-white text-teal-600" />
                  <span>Confirmar por WhatsApp</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.section>

        {/* Share Invitation & Footer */}
        <footer className="mt-16 text-center text-xs text-teal-300/60 pb-20">
          <div className="flex justify-center mb-6">
            <motion.button
              type="button"
              onClick={copyPageUrl}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full border border-teal-700/50 bg-teal-950/60 px-4 py-2 text-xs font-medium text-teal-200 hover:text-white transition-colors"
            >
              <Share2 className="h-3.5 w-3.5 text-amber-300" />
              <span>
                {copiedLink
                  ? "¡Enlace copiado al portapapeles!"
                  : "Compartir esta invitación"}
              </span>
            </motion.button>
          </div>

          <div className="sombra-oro my-1">
            <p className="titulo-script texto-dorado text-4xl sm:text-5xl">
              Jose Ronaldo Ortiz Garnica
            </p>
          </div>
          <p className="subtitulo-elegante text-[11px] text-teal-300/80 mt-1 tracking-[2px]">
            Licenciado en Administración de Empresas • 2026
          </p>
          <p className="mt-1 text-[11px] text-teal-400/50">
            Facultad Integral Ichilo
          </p>
        </footer>
      </div>

      {/* ========================================================
          BOTÓN FLOTANTE PERMANENTE DE WHATSAPP (Móvil & Desktop)
      ======================================================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <motion.button
          type="button"
          onClick={handleRsvpWithConfetti}
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-white shadow-2xl hover:bg-teal-400 transition-colors border-2 border-amber-300/70 focus:outline-none cursor-pointer"
          title="Confirmar Asistencia vía WhatsApp"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
          </span>
          <MessageCircle className="h-7 w-7 fill-white text-teal-600" />
        </motion.button>
      </motion.div>
    </div>
  );
}
