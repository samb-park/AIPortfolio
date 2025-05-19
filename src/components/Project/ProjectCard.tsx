import { Project } from "@/services/projectService";

function highlightText(text: string, highlight: string) {
  if (!highlight) return text;
  const regex = new RegExp(`(${highlight})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === highlight.toLowerCase() ? <mark key={i}>{part}</mark> : part
  );
}

function ProjectCard({ project, highlight = "" }: { project: Project; highlight?: string }) {
  return (
    <div className="border-2 border-gray-600 rounded-b-md rounded-lg p-4">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">{highlightText(project.name, highlight)}</h1>
        {project.organization && (
          <span className="ml-2 bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">{project.organization}</span>
        )}
      </div>
      <p className="text-gray-400 mb-2">{project.date}</p>
      <div className="text-gray-300 mb-2">
        {project.description.map((desc, idx) => (
          <p key={idx}>- {highlightText(desc, highlight)}</p>
        ))}
      </div>
      <div className="flex gap-2 mb-2">
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-green-400 underline text-sm">Visit Site</a>
        )}
        {project.gitUrl && (
          <a href={project.gitUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-sm">Visit Code</a>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.skills.map((skill, idx) => (
          <span key={idx} className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs">{skill}</span>
        ))}
      </div>
    </div>
  );
}

export default ProjectCard;