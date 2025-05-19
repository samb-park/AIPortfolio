"use client"

import React, { useEffect, useState } from "react";
import { getProjects, Project } from "@/services/projectService";
import ProjectCard from "@/components/Project/ProjectCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(search.toLowerCase()) ||
    project.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">PROJECTS</h1>
      <div className="relative w-full mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-2 pl-10 border-2 border-gray-600 rounded-lg bg-transparent focus:outline-none  focus:border-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.map((project, idx) => (
          <ProjectCard key={idx} project={project} highlight={search} />
        ))}
      </div>
    </>
  );
}