import { DistanceConfig, DistanceType } from './types';

export const SPEED_SESSIONS = [
  "100m Intervals",
  "400m Intervals",
  "800m Intervals",
  "Hill Repeats",
];

export const MEDIUM_SESSIONS = [
  "Fartlek",
  "Tempo",
  "Progression",
  "Long Intervals",
  "Threshold",
];

export const LONG_SESSIONS = [
  "Long Run",
  "Long Run", 
  "Long Run",
  "Long Run (Sprint Finish)",
  "Long Run (Sprint Finish)",
  "Long Run (Progression)",
  "Long Run (Progression)",
  "Long Run (Race Pace)",
];

export const DISTANCE_CONFIGS: Record<DistanceType, DistanceConfig> = {
  [DistanceType.FiveK]: {
    minEasy: 5, maxEasy: 8,
    minMedium: 4, maxMedium: 5,
    minSpeed: 3, maxSpeed: 4,
    minLong: 8, maxLong: 12,
    taperWeeks: 0
  },
  [DistanceType.TenK]: {
    minEasy: 6, maxEasy: 9,
    minMedium: 5, maxMedium: 8,
    minSpeed: 4, maxSpeed: 7,
    minLong: 8, maxLong: 14,
    taperWeeks: 0
  },
  [DistanceType.HalfMarathon]: {
    minEasy: 7, maxEasy: 12,
    minMedium: 6, maxMedium: 10,
    minSpeed: 5, maxSpeed: 10,
    minLong: 10, maxLong: 18,
    taperWeeks: 2
  },
  [DistanceType.Marathon]: {
    minEasy: 8, maxEasy: 16,
    minMedium: 7, maxMedium: 13,
    minSpeed: 7, maxSpeed: 10,
    minLong: 12, maxLong: 35,
    taperWeeks: 3
  }
};

export const RUN_DESCRIPTIONS = [
  {
    category: "Rest/Recovery",
    items: [
      { name: "Rest", desc: "Complete rest. Prioritize sleep and hydration to let muscles repair from hard efforts. (RPE: 0/10)" },
      { name: "Crosstrain", desc: "Active recovery. Swimming, cycling, yoga, or light strength work. Keep heart rate low to flush out soreness without impact. (RPE: 2-3/10)" }
    ]
  },
  {
    category: "Easy Runs",
    items: [
      { name: "Easy Run", desc: "Conversation pace. You should be able to speak in full sentences without gasping. This builds aerobic base and recovery. (RPE: 3-4/10)" }
    ]
  },
  {
    category: "Endurance (Medium)",
    items: [
      { name: "Tempo Run", desc: "\"Comfortably hard\". A steady effort where you can speak in short phrases but not full sentences. Improves lactate threshold. (RPE: 6-7/10)" },
      { name: "Fartlek", desc: "Swedish for 'Speed Play'. Unstructured intervals. Sprint to a landmark (tree, sign), jog to the next. Fun and flexible. (RPE: Varies 4-8/10)" },
      { name: "Progression", desc: "Negative splits. Start easy (RPE 3), and gradually increase speed by ~10-15s/km every kilometer. Finish fast at threshold effort. (RPE: 3 -> 8/10)" },
      { name: "Threshold", desc: "The fastest pace you can sustain for about 60 minutes. Concentration is required, but you aren't straining. (RPE: 7-8/10)" }
    ]
  },
  {
    category: "Speed (High Intensity)",
    items: [
      { name: "Intervals (100m/400m/800m)", desc: "Short, fast bursts at 5k to 1 mile race pace. Focus on high turnover and good form. Recovery is a slow jog or walk. (RPE: 8-9/10)" },
      { name: "Hill Repeats", desc: "Run up a moderate to steep hill hard for 30-60s, walk/jog down. Builds explosive power and strength with less impact. (RPE: 9/10)" }
    ]
  },
  {
    category: "Long Runs",
    items: [
      { name: "Long Run", desc: "The most important run for endurance. Keep it slow (60-90s/km slower than race pace). Focus on time on feet. (RPE: 3-4/10)" },
      { name: "Long Run (Race Pace)", desc: "A long run that includes blocks at your goal race pace (e.g., last 5k at goal pace) to practice running fast on tired legs. (RPE: 4 -> 7/10)" }
    ]
  }
];