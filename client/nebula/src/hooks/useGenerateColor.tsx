import { useState } from "react";

const useGenerateRandomColor = () => {
  const [color, setColor] = useState("");
  const generateColor = () => {
    setColor(
      "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),
    );
  };
  return { color, generateColor };
};
export default useGenerateRandomColor;
