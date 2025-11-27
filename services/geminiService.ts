import { GoogleGenAI } from "@google/genai";
import { DistanceType, WeeklyPlan } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAICoachAdvice = async (
  distance: DistanceType, 
  weeks: number, 
  planSummary: WeeklyPlan[]
): Promise<string> => {
  
  // Extract a summary to send to AI (sending full JSON might be too large for context if plan is huge, but usually fine)
  // We will send the peak week (usually the one before taper)
  const peakWeekIndex = Math.max(0, planSummary.length - 2); 
  const peakWeek = planSummary[peakWeekIndex];

  const prompt = `
    I have generated a running training plan for a ${distance} race over ${weeks} weeks.
    
    Here is a snapshot of the peak training week (Week ${peakWeek.weekNumber}):
    - Day 2: ${peakWeek.days[1].type} (${peakWeek.days[1].distance}km)
    - Day 4: ${peakWeek.days[3].type} (${peakWeek.days[3].distance}km)
    - Day 7: ${peakWeek.days[6].type} (${peakWeek.days[6].distance}km)

    Act as a world-class running coach. Please provide:
    1. A brief analysis of this training load.
    2. Three specific tips for training for a ${distance}.
    3. One motivational quote suitable for a runner.

    Keep the tone encouraging, professional, and concise. Format with Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Coach is currently out for a run. Please try again later.";
  } catch (error) {
    console.error("AI Coach Error:", error);
    return "The AI Coach is currently unavailable. Please check your network connection.";
  }
};