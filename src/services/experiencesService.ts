import experiencesData from "@/data/experiences.json";

export interface Experience {
  date: string;
  name: string;
  location: string;
  title: string;
  description: string[];
  skills: string[];
}

export function getExperiences(): Experience[] {
  return experiencesData.experiences;
} 