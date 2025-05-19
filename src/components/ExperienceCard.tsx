import { Experience } from "@/services/experiencesService";

function highlightText(text: string, highlight: string) {
  if (!highlight) return text;
  const regex = new RegExp(`(${highlight})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === highlight.toLowerCase() ? <mark key={i}>{part}</mark> : part
  );
}

function ExperienceCard({ experience, highlight = "" }: { experience: Experience; highlight?: string }) {
  return (
    <div className="border-2 border-gray-600 rounded-b-md rounded-lg p-4">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">{highlightText(experience.name, highlight)}</h1>
        <span className="ml-2 bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">{experience.location}</span>
      </div>
      <p className="text-gray-400 mb-2">{experience.date}</p>
      <div className="text-gray-300 mb-2">
        <span className="font-semibold">{experience.title}</span>
        {experience.description.map((desc, idx) => (
          <p key={idx}>- {highlightText(desc, highlight)}</p>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {experience.skills.map((skill, idx) => (
          <span key={idx} className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs">{skill}</span>
        ))}
      </div>
    </div>
  );
}

export default ExperienceCard; 