import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Melodía ambiental generada con Web Audio (sin archivos externos).
 * Arpegio suave y romántico en bucle, ideal como música de fondo de la invitación.
 */
const NOTES = [392, 493.88, 587.33, 493.88, 523.25, 659.25, 783.99, 659.25];

export function useAmbientMusic() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    gainRef.current?.gain.setTargetAtTime(0, ctxRef.current?.currentTime ?? 0, 0.2);
    setPlaying(false);
  }, []);

  const start = useCallback(() => {
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
    master.gain.setTargetAtTime(0.16, ctx.currentTime, 0.4);

    const playNote = () => {
      const freq = NOTES[stepRef.current % NOTES.length];
      stepRef.current += 1;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(0.5, now + 0.08);
      env.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
      osc.connect(env).connect(master);
      osc.start(now);
      osc.stop(now + 2.5);

      const pad = ctx.createOscillator();
      const padEnv = ctx.createGain();
      pad.type = "sine";
      pad.frequency.value = freq / 2;
      padEnv.gain.setValueAtTime(0, now);
      padEnv.gain.linearRampToValueAtTime(0.18, now + 0.5);
      padEnv.gain.exponentialRampToValueAtTime(0.0001, now + 3);
      pad.connect(padEnv).connect(master);
      pad.start(now);
      pad.stop(now + 3.1);
    };

    playNote();
    timerRef.current = setInterval(playNote, 900);
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
