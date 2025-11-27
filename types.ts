export enum DistanceType {
  FiveK = '5k',
  TenK = '10k',
  HalfMarathon = 'half-marathon',
  Marathon = 'marathon'
}

export type FeedbackType = 'easy' | 'good' | 'hard';

export interface RunSession {
  type: string;
  distance: number;
  description?: string;
  category: 'Rest' | 'Easy' | 'Speed' | 'Medium' | 'Long';
  completed?: boolean;
  feedback?: FeedbackType;
  notes?: string;
}

export interface WeeklyPlan {
  weekNumber: number;
  days: RunSession[]; // Array of 7 days
}

export interface SavedPlan {
  id: string;
  name: string;
  distance: DistanceType;
  weeks: number;
  createdAt: number;
  plan: WeeklyPlan[];
}

export interface DistanceConfig {
  minEasy: number;
  maxEasy: number;
  minMedium: number;
  maxMedium: number;
  minSpeed: number;
  maxSpeed: number;
  minLong: number;
  maxLong: number;
  taperWeeks: number;
}