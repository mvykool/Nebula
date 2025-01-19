import { useEffect, useState } from "react";
import { gradientPairs } from "../utils/colors";

// Define the gradient direction types
type GradientDirection = "to right" | "to right bottom" | "to bottom";

interface GradientPair {
  start: string;
  end: string;
  direction: GradientDirection;
}

export const useGenerateGradient = (customGradients?: GradientPair[]) => {
  const [gradient, setGradient] = useState<string>("");

  useEffect(() => {
    const pairs = customGradients || gradientPairs;
    const randomPair = pairs[Math.floor(Math.random() * pairs.length)];

    const gradientString = `linear-gradient(${randomPair.direction}, ${randomPair.start}, ${randomPair.end})`;
    setGradient(gradientString);
  }, [customGradients]);

  return gradient;
};
