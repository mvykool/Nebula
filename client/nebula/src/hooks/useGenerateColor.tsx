import { useEffect, useState } from "react";

export const useGenerateRandomColor = (colors: string[]) => {
  const [color, setColor] = useState("");

  useEffect(() => {
    const randomColors = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColors);
  }, [colors]);
  return color;
};
