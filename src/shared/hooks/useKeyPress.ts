import { useEffect } from "react";

type MetaKey = "ctrlKey" | "shiftKey" | "altKey";

export default function useKeyPress(
  targetKey: string,
  callback: () => void,
  metaKey?: MetaKey,
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (metaKey && !event[metaKey]) {
        return;
      }
      if (event.key.toLowerCase() === targetKey.toLowerCase()) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [targetKey, callback, metaKey]);
}
