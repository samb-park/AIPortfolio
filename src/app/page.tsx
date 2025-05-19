// 예시: 마크다운에서 제목과 설명을 불러오는 함수
async function getMarkdownMeta() {
  // 실제로는 파일을 읽거나, fetch 등으로 데이터를 가져올 수 있습니다.
  // 여기서는 예시로 하드코딩합니다.
  return {
    title: "Sangbong's Portfolio",
    description: "Sangbong's Portfolio",
  };
}

// 동적 메타데이터 함수
export async function generateMetadata() {
  const meta = await getMarkdownMeta();
  return {
    title: meta.title,
    description: meta.description,
  };
}

import AskAI from "@/components/AskAI";

export default function Home() {
  return (
    <AskAI />
  );
}
