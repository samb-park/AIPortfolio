import { NextRequest, NextResponse } from "next/server";
import projectsData from "@/data/projects.json";
import experiencesData from "@/data/experiences.json";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // 예시 질문 추천 분기
  if (body.suggestExamples) {
    // chat: {role, content}[]
    const chatHistory = body.chat || [];
    const prompt = `Below is Sangbong's resume and project list.\n\n[Experiences]\n${JSON.stringify(experiencesData.experiences, null, 2)}\n\n[Projects]\n${JSON.stringify(projectsData.projects, null, 2)}\n\nHere is the recent chat history:\n${JSON.stringify(chatHistory, null, 2)}\n\nSuggest 3~5 next user questions that would be helpful to ask about Sangbong, based on the chat so far.\n\nReturn ONLY a JSON array of objects like [{label: '...', value: '...'}]. Do not include any explanation or text outside the JSON array.`;
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-8b-instruct:free",
        messages: [
          { role: "system", content: "You are an AI assistant for Sangbong's resume and portfolio. Always answer in English and ONLY in valid JSON format. If the question is not about Sangbong, reply: {\"answer\": \"I can only answer questions about Sangbong.\"}" },
          { role: "user", content: prompt }
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });
    const data = await response.json();

    let examples = [];
    try {
      examples = JSON.parse(data.choices?.[0]?.message?.content || "");
      if (!Array.isArray(examples)) throw new Error();
    } catch {
      examples = [
        { label: "What has Sangbong done recently?", value: "What has Sangbong done recently?" },
        { label: "Tell me about Sangbong's project experience.", value: "Tell me about Sangbong's project experience." },
        { label: "List a project Sangbong worked on with a link.", value: "List a project Sangbong worked on with a link." },
        { label: "What C# experience does Sangbong have?", value: "What C# experience does Sangbong have?" }
      ];
    }
    return NextResponse.json({ examples });
  }

  // 기존 답변 생성 분기
  const { question } = body;
  const prompt = `Below is Sangbong's resume and project list.\n\n[Experiences]\n${JSON.stringify(experiencesData.experiences, null, 2)}\n\n[Projects]\n${JSON.stringify(projectsData.projects, null, 2)}\n\nUser question: ${question}\n\nYou must answer ONLY in English, and ONLY in valid JSON format with three fields:\n- \"answer\": a summary in natural language,\n- \"projects\": a list of related project names (as strings, from the above list),\n- \"experiences\": a list of related experience names (as strings, from the above list).\nReturn only valid JSON. If the question is not about Sangbong or the information above, reply strictly with: {\"answer\": \"I can only answer questions about Sangbong.\", \"projects\": [], \"experiences\": []}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-8b-instruct:free",
      messages: [
        { role: "system", content: "You are an AI assistant for Sangbong's resume and portfolio. Always answer in English and ONLY in valid JSON format like {\"answer\": \"...\", \"projects\": [\"project name\", ...], \"experiences\": [\"experience name\", ...]}. For projects and experiences, ONLY return an array of names (strings) from the provided lists. If the question is not about Sangbong, reply: {\"answer\": \"I can only answer questions about Sangbong.\", \"projects\": [], \"experiences\": []}. Do NOT include any other fields or extra information in the projects or experiences arrays." },
        { role: "user", content: prompt }
      ],
      max_tokens: 512,
      temperature: 0.7,
    }),
  });
  const data = await response.json();


  let parsedContent: { answer?: string; projects?: unknown[]; experiences?: unknown[] } = {};

  try {
    const content = data.choices?.[0]?.message?.content || "";
    console.log("🔍 content:", content);
    let jsonString = content;
    // 코드블록(```json ... ```, ``` ... ```) 감싸진 경우 추출
    const codeBlockMatch = content.match(/```json\s*([\s\S]*?)```/i) || content.match(/```\s*([\s\S]*?)```/i);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1];
    }
    try {
      parsedContent = JSON.parse(jsonString.trim());
      console.log("🔍 parsedContent:", parsedContent);
      // 필수 필드 보장
      if (!('projects' in parsedContent)) parsedContent.projects = [];
      if (!('experiences' in parsedContent)) parsedContent.experiences = [];
      if (!('answer' in parsedContent)) parsedContent.answer = "I could not generate a valid JSON answer.";
    } catch (e) {
      console.error("❌ Failed to parse OpenRouter content for answer:", e);
      parsedContent.answer = "AI 응답을 파싱하는 데 실패했습니다. 다시 시도해 주세요.";
      parsedContent.projects = [];
      parsedContent.experiences = [];
    }
  } catch {
    parsedContent.answer = "I could not generate a valid JSON answer.";
    parsedContent.projects = [];
    parsedContent.experiences = [];
  }

  return NextResponse.json(parsedContent);
} 