export type Athlete = {
  id: string;
  name: Record<"fa" | "en", string>;
  sport: Record<"fa" | "en", string>;
  score: number;
  goal: number;
  raised: number;
  tierWeight: number;
};

export const athletes = [
  { id: "a1", name: { en: "Sample Athlete 1", fa: "نمونه ورزشکار ۱" }, sport: { en: "Football", fa: "فوتبال" }, score: 84, goal: 5000, raised: 3100, tierWeight: 62 },
  { id: "a2", name: { en: "Sample Athlete 2", fa: "نمونه ورزشکار ۲" }, sport: { en: "Wrestling", fa: "کشتی" }, score: 78, goal: 5000, raised: 2050, tierWeight: 48 },
  { id: "a3", name: { en: "Sample Athlete 3", fa: "نمونه ورزشکار ۳" }, sport: { en: "Volleyball", fa: "والیبال" }, score: 81, goal: 5000, raised: 2750, tierWeight: 58 },
] as const satisfies readonly Athlete[];

export function getAthlete(id: string): Athlete | undefined {
  return athletes.find((athlete) => athlete.id === id);
}
