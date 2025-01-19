type GradientDirection = "to right" | "to right bottom";

interface GradientPair {
  start: string;
  end: string;
  direction: GradientDirection;
}

export const gradientPairs: GradientPair[] = [
  {
    start: "#D2E0FB",
    end: "#f8e2d0",
    direction: "to right bottom",
  },
  {
    start: "#e6e9f0",
    end: "#FFC0D9",
    direction: "to right",
  },
  {
    start: "#f5f7fa",
    end: "#F1D3CE",
    direction: "to right",
  },
  {
    start: "#fff1eb",
    end: "#f2e2e9",
    direction: "to right bottom",
  },
  {
    start: "#f3e7e9",
    end: "#e3eeff",
    direction: "to right",
  },
  {
    start: "#e9defa",
    end: "#fbfcdb",
    direction: "to right",
  },
  {
    start: "#f5f7fa",
    end: "#c3cfe2",
    direction: "to right bottom",
  },
  {
    start: "#dfe9f3",
    end: "#ffffff",
    direction: "to right",
  },
];
