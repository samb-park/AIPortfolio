"use client";

import { useState, useRef, useEffect } from "react";
import ProjectCard from "./Project/ProjectCard";
import ExperienceCard from "./ExperienceCard";
import type { Project } from "@/services/projectService";
import type { Experience } from "@/services/experiencesService";
import projectsData from "@/data/projects.json";
import experiencesData from "@/data/experiences.json";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  projectUrl?: string;
}

export default function AskAI() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [examples, setExamples] = useState([
    { label: "What has Sangbong done recently?", value: "What has Sangbong done recently?" },
    { label: "Tell me about Sangbong's project experience.", value: "Tell me about Sangbong's project experience." },
    { label: "List a project Sangbong worked on with a link.", value: "List a project Sangbong worked on with a link." },
    { label: "What C# experience does Sangbong have?", value: "What C# experience does Sangbong have?" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  // 오른쪽에 보여줄 리스트 상태
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [experienceList, setExperienceList] = useState<Experience[]>([]);

  // AI에게 예시 질문 추천 요청
  const fetchExamples = async (chatHistory: ChatMessage[]) => {
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestExamples: true, chat: chatHistory }),
      });
      const data = await res.json();
      if (Array.isArray(data.examples)) {
        setExamples(data.examples);
      }
    } catch {
      // 실패 시 기존 예시 유지
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = { role: "user", content: input };
    setChat(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      // answer, projects, experiences 파싱
      let projectUrl;
      let answer = typeof data.answer === "string" ? data.answer : "";
      console.log("🔍 answer:", data);
      console.log("🔍 projects:", data.projects);
      console.log("🔍 experiences:", data.experiences);

      // AI 응답의 projects는 이제 string[]임
      const aiProjectNames: string[] = Array.isArray(data.projects) ? data.projects as string[] : [];
      // projects.json에서 name이 일치하는 프로젝트만 필터링
      const filteredProjects: Project[] = (projectsData.projects as Project[]).filter((proj) => aiProjectNames.includes(proj.name));
      setProjectList(filteredProjects);
      // AI 응답의 experiences도 string[]임
      const aiExperienceNames: string[] = Array.isArray(data.experiences) ? data.experiences as string[] : [];
      // experiences.json에서 name이 일치하는 경험만 필터링
      const filteredExperiences: Experience[] = (experiencesData.experiences as Experience[]).filter((exp) => aiExperienceNames.includes(exp.name));
      setExperienceList(filteredExperiences);
      if (!answer) {
        answer = "I could not generate a valid JSON answer.";
      }
      // answer에서 url 추출 (있을 경우)
      const urlMatch = answer.match(/https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/);
      if (urlMatch) {
        projectUrl = urlMatch[0];
      }
      const aiMessage: ChatMessage = { role: "ai", content: answer, projectUrl };
      setChat(prev => [...prev, aiMessage]);
      fetchExamples([...chat, userMessage, aiMessage]);
    } catch {
      setChat(prev => [...prev, { role: "ai", content: "Sorry, there was an error." }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // 최초 렌더링 시 예시 질문 추천
  useEffect(() => {
    if (chat.length === 0) fetchExamples([]);
    // eslint-disable-next-line
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  };

  // 카드 리스트 컴포넌트
  function ProjectList() {
    if (!projectList.length) return null;
    return (
      <>
        <h3 className="text-xl font-bold mb-4 text-gray-100">Projects</h3>
        <div className="h-full overflow-y-auto p-4 space-y-4 bg-gray-900 border-l border-gray-700 ">
        {projectList.map((project, idx) => (
          <ProjectCard key={idx} project={project} />
        ))}
      </div>
      </>

    );
  }
  function ExperienceList() {
    if (!experienceList.length) return null;
    return (
      <>
        <h3 className="text-xl font-bold mb-4 text-gray-100 mt-8">Experiences</h3>
        <div className="h-full overflow-y-auto p-4 space-y-4 bg-gray-900 border-l border-gray-700">
          {experienceList.map((exp, idx) => (
            <ExperienceCard key={idx} experience={exp} />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className=" w-full h-full grid grid-cols-1 md:grid-cols-2">
      {/* 채팅창 */}
      <div className="w-full md:min-w-[350px] md:max-w-[700px]">
        <div className="flex-1 w-full h-full flex flex-col border border-gray-600 rounded shadow bg-gray-800">
          <h2 className="text-lg font-bold p-4 border-b border-gray-600 text-gray-100">AI Chat about Sangbong</h2>
          <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-gray-600 bg-gray-700">
            {examples.map((ex, idx) => (
              <button
                key={idx}
                className="bg-gray-700 text-blue-300 px-3 py-1 rounded hover:bg-gray-600 text-sm border border-gray-600 transition-colors"
                onClick={() => setInput(ex.value)}
                type="button"
              >
                {ex.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-800 flex flex-col justify-end">
            {chat.length === 0 && (
              <div className="text-gray-400 text-center">Ask anything about Sangbong&apos;s resume or projects!</div>
            )}
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.role === "user"
                    ? "text-right"
                    : "text-left"
                }
              >
                <span
                  className={
                    msg.role === "user"
                      ? "inline-block bg-blue-600 text-white rounded-lg px-4 py-2 my-1 max-w-[80%]"
                      : "inline-block bg-gray-700 text-gray-200 rounded-lg px-4 py-2 my-1 max-w-[80%]"
                  }
                >
                  {msg.content}
                </span>
                {msg.role === "ai" && msg.projectUrl && (
                  <a
                    href={msg.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-block bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                  >
                    Visit Project
                  </a>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form
            className="p-4 border-t border-gray-600 flex gap-2 bg-gray-800"
            onSubmit={e => {
              e.preventDefault();
              if (!loading) handleSend();
            }}
          >
            <textarea
              className="flex-1 border border-gray-600 rounded p-2 resize-none min-h-[40px] max-h-[120px] bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question and press Enter..."
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-800 transition-colors"
              disabled={loading || !input.trim()}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      </div>
      {/* 카드 리스트 패널 */}
      <div className="w-full flex flex-col gap-4 ml-5 md:min-w-[350px] md:max-w-[700px] max-h-[50vh] md:max-h-[80vh] overflow-y-auto">
        {projectList.length > 0 && <ProjectList />}
        {experienceList.length > 0 && <ExperienceList />}
      </div>
    </div>
  );
} 