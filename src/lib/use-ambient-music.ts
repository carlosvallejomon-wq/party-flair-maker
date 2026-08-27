import { useCallback, useEffect, useRef, useState } from "react";

import type { Melodia } from "@/lib/invitacion";

/**
 * Melodías ambientales generadas con Web Audio (sin archivos externos).
 */
const MELODIAS: Record<Melodia, { notas: number[]; tempo: number; tipo: OscillatorType }> = {
  romantica: {
    notas: [392, 493.88, 587.33, 493.88, 523.25, 659.25, 783.99, 659.25],
    tempo: 900,
    tipo: "triangle",
  },
  vals: {
    notas: [440, 554.37, 659.25, 554.37, 493.88, 587.33, 739.99, 587.33],
    tempo: 700,
    tipo: "sine",
  },
  alegre: {
    notas: [523.25, 587.33, 659.25, 783.99, 880, 783.99, 659.25, 587.33],
    tempo: 520,
    tipo: "square",
  },
  serena: {
    notas: [349.23, 392, 440, 523.25, 440, 392],
    tempo: 1300,
    tipo: "sine",
  },
};

export function useAmbientMusic(melodia: Melodia = "romantica", url?: string) {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);
  const melodiaRef = useRef(melodia);
  melodiaRef.current = melodia;
  const urlRef = useRef(url);
  urlRef.current = url;

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    gainRef.current?.gain.setTargetAtTime(0, ctxRef.current?.currentTime ?? 0, 0.2);
    audioRef.current?.pause();
    setPlaying(false);
  }, []);


  const start = useCallback(() => {
    const pista = urlRef.current?.trim();
    if (pista) {
      if (!audioRef.current) {
        const el = new Audio(pista);
        el.loop = true;
        el.volume = 0.6;
        audioRef.current = el;
      } else if (audioRef.current.src !== pista) {
        audioRef.current.src = pista;
      }
      void audioRef.current.play().catch(() => undefined);
      setPlaying(true);
      return;
    }

    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;

    if (!ctxRef.current) {
      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      gainRef.current = master;
    }
    const ctx = ctxRef.current;
    const master = gainRef.current!;
    void ctx.resume();
    master.gain.setTargetAtTime(0.14, ctx.currentTime, 0.4);

    const cfg = MELODIAS[melodiaRef.current] ?? MELODIAS.romantica;

    const playNote = () => {
      const actual = MELODIAS[melodiaRef.current] ?? MELODIAS.romantica;
      const freq = actual.notas[stepRef.current % actual.notas.length] ?? 440;
      stepRef.current += 1;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = actual.tipo;
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(0.4, now + 0.08);
      env.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
      osc.connect(env).connect(master);
      osc.start(now);
      osc.stop(now + 2.5);

      const pad = ctx.createOscillator();
      const padEnv = ctx.createGain();
      pad.type = "sine";
      pad.frequency.value = freq / 2;
      padEnv.gain.setValueAtTime(0, now);
      padEnv.gain.linearRampToValueAtTime(0.16, now + 0.5);
      padEnv.gain.exponentialRampToValueAtTime(0.0001, now + 3);
      pad.connect(padEnv).connect(master);
      pad.start(now);
      pad.stop(now + 3.1);
    };

    playNote();
    timerRef.current = setInterval(playNote, cfg.tempo);
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (playing) stop();
    else start();
  }, [playing, start, stop]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      void ctxRef.current?.close();
    };
  }, []);

  return { playing, toggle };
}
