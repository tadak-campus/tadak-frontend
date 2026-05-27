import { useEffect, useState } from "react";

const useKeyboardInput = () => {
  const [pressedCodes, setPressedCodes] = useState<Set<string>>(new Set());
  const [shiftActive, setShiftActive] = useState(false);

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      setPressedCodes((prev) => {
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });

      if (e.key === "Shift") setShiftActive(true);
    };

    const handleUp = (e: KeyboardEvent) => {
      setPressedCodes((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });

      if (e.key === "Shift") setShiftActive(false);
    };

    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, []);

  return { pressedCodes, shiftActive };
};

export default useKeyboardInput;
