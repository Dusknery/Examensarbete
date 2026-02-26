export const IMAGE_PRESETS = {
  headshot: {
    key: "headshot",
    label: "Headshot (horse detail)",
    aspect: 1 / 1,
    output: { width: 1200, height: 1200 },
    preview: { width: 550, height: 550 },
    targetField: "images.headshot",
  },

  card: {
    key: "card",
    label: "Kortbild (horses list)",
    aspect: 3 / 4,
    output: { width: 900, height: 1200 },
    preview: { width: 240, height: 320 },
    targetField: "images.card",
  },

  stallion: {
    key: "stallion",
    label: "Hingstbild (stallions page)",
    aspect: 5 / 3, // 1000x600 i din CSS
    output: { width: 1500, height: 900 },
    preview: { width: 1000, height: 600 },
    targetField: "images.stallion",
  },

  bodyshot: {
    key: "bodyshot",
    label: "Bodyshot (horse detail, liggande)",
    aspect: 5 / 3, // landscape
    output: { width: 1500, height: 900 },
    preview: { width: 1000, height: 600 },
    targetField: "images.bodyshot",
  },

  pedigree: {
    key: "pedigree",
    label: "Pedigree",
    aspect: 3 / 2,
    output: { width: 1500, height: 1000 },
    preview: { width: 700, height: 467 },
    targetField: "images.pedigree",
  },
};
