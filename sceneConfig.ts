export type SceneFeatures = {
  showMoon: boolean;
  showLighthouse: boolean;
  showFlowers: boolean;
  showAnimals: boolean;
  showFireflies: boolean;
  showClouds: boolean;
  showLantern: boolean;
  showMoonReflection: boolean;
};

export type SceneConfig = {
  features: SceneFeatures;
  timing: {
    stars: number;
    moon: number;
    ocean: number;
    character: number;
    fireflies: number;
    copy: number;
    begin: number;
  };
  copy: {
    eyebrow: string;
    title: string;
    subtitle: string;
    beginLabel: string;
    enteredMessage: string;
  };
  audio: Array<{
    id: "ocean" | "wind" | "night";
    src: string;
    volume: number;
  }>;
};

export const sceneConfig: SceneConfig = {
  features: {
    showMoon: true,
    showLighthouse: true,
    showFlowers: true,
    showAnimals: true,
    showFireflies: true,
    showClouds: true,
    showLantern: true,
    showMoonReflection: true,
  },
  timing: {
    stars: 1,
    moon: 2,
    ocean: 3,
    character: 5,
    fireflies: 6,
    copy: 0.2,
    begin: 1,
  },
  copy: {
    eyebrow: "DRIFT · A LIVING DOCUMENTARY",
    title: "Some stories begin quietly.",
    subtitle: "Every person deserves a documentary.",
    beginLabel: "Begin",
    enteredMessage: "Take your time. Your story is already here.",
  },
  audio: [
    { id: "ocean", src: "/audio/ocean.wav", volume: 0.32 },
    { id: "wind", src: "/audio/wind.wav", volume: 0.1 },
    { id: "night", src: "/audio/night.wav", volume: 0.18 },
  ],
};
