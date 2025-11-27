import { DistanceType, WeeklyPlan, RunSession, DistanceConfig } from './types';
import { SPEED_SESSIONS, MEDIUM_SESSIONS, LONG_SESSIONS, DISTANCE_CONFIGS } from './constants';

export const getRandomSession = (array: string[]) => array[Math.floor(Math.random() * array.length)];

export const getIncreasingNumberBetween = (min: number, max: number, i: number, totalWeeks: number) => {
  const difference = max - min;
  const increment = difference / totalWeeks;
  return Math.round(min + increment * i);
};

export const generatePlan = (distance: DistanceType, totalWeeks: number): WeeklyPlan[] => {
  const config = DISTANCE_CONFIGS[distance];
  const trainingWeeks = totalWeeks - 1 - config.taperWeeks; // Reserve last week for race, plus taper
  const plan: WeeklyPlan[] = [];

  const createSession = (category: RunSession['category'], type: string, distance: number): RunSession => ({
    category,
    type,
    distance,
    completed: false,
    feedback: undefined,
    notes: ''
  });

  // Generate Base Training Weeks
  for (let i = 1; i <= trainingWeeks; i++) {
    const mediumDist = getIncreasingNumberBetween(config.minMedium, config.maxMedium, i, trainingWeeks);
    const speedDist = getIncreasingNumberBetween(config.minSpeed, config.maxSpeed, i, trainingWeeks);
    const easyDist = getIncreasingNumberBetween(config.minEasy, config.maxEasy, i, trainingWeeks);
    const longDist = getIncreasingNumberBetween(config.minLong, config.maxLong, i, trainingWeeks);

    const week: WeeklyPlan = {
      weekNumber: i,
      days: [
        createSession('Rest', 'Rest or Crosstrain', 0), // Day 1
        createSession('Medium', getRandomSession(MEDIUM_SESSIONS), mediumDist), // Day 2
        createSession('Easy', 'Easy', easyDist), // Day 3
        createSession('Speed', getRandomSession(SPEED_SESSIONS), speedDist), // Day 4
        createSession('Rest', 'Rest or Crosstrain', 0), // Day 5
        createSession('Easy', 'Easy', easyDist), // Day 6
        createSession('Long', getRandomSession(LONG_SESSIONS), longDist), // Day 7
      ]
    };
    plan.push(week);
  }

  // Generate Taper Weeks
  if (distance === DistanceType.HalfMarathon) {
    plan.push(createTaperWeek(trainingWeeks + 1, 7, 7, 10, 15));
    plan.push(createTaperWeek(trainingWeeks + 2, 6, 5, 10, 12));
  } else if (distance === DistanceType.Marathon) {
    plan.push(createTaperWeek(trainingWeeks + 1, 10, 8, 12, 26));
    plan.push(createTaperWeek(trainingWeeks + 2, 8, 6, 10, 20));
    plan.push(createTaperWeek(trainingWeeks + 3, 7, 4, 10, 16));
  }

  // Race Week
  const raceWeekNum = plan.length + 1;
  plan.push({
    weekNumber: raceWeekNum,
    days: [
      createSession('Rest', 'Rest or Crosstrain', 0),
      createSession('Easy', 'Easy', 5),
      createSession('Rest', 'Rest or Crosstrain', 0),
      createSession('Rest', 'Rest', 0),
      createSession('Easy', 'Easy', 3),
      createSession('Rest', 'Rest', 0),
      createSession('Long', 'RACE DAY!', distance === DistanceType.FiveK ? 5 : distance === DistanceType.TenK ? 10 : distance === DistanceType.HalfMarathon ? 21.1 : 42.2),
    ]
  });

  return plan;
};

const createTaperWeek = (weekNum: number, medium: number, speed: number, easy: number, long: number): WeeklyPlan => {
  const createSession = (category: RunSession['category'], type: string, distance: number): RunSession => ({
    category,
    type,
    distance,
    completed: false,
    feedback: undefined,
    notes: ''
  });

  return {
    weekNumber: weekNum,
    days: [
      createSession('Rest', 'Rest or Crosstrain', 0),
      createSession('Medium', getRandomSession(MEDIUM_SESSIONS), medium),
      createSession('Easy', 'Easy', easy),
      createSession('Speed', getRandomSession(SPEED_SESSIONS), speed),
      createSession('Rest', 'Rest or Crosstrain', 0),
      createSession('Easy', 'Easy', easy),
      createSession('Long', getRandomSession(LONG_SESSIONS), long),
    ]
  };
};