import { useCallback, useRef } from "react";

export default function useClickSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/Cool%20interface.wav");
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);

  return play;
}
