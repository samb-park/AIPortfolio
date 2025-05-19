import projectsData from "@/data/projects.json";

export interface Project {
  date: string;
  name: string;
  organization?: string;
  url?: string;
  gitUrl?: string;
  description: string[];
  skills: string[];
}

export function getProjects(): Project[] {
  return projectsData.projects;
} 