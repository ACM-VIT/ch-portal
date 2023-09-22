import AuthWrapper from "@/components/AuthWrapper";
import { useQuestionGroups } from "@/contexts/questions";

export default function Home() {
  const [questionGroups] = useQuestionGroups();
  return (
    <AuthWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-6xl font-bold">Welcome to the Next.js Starter</h1>
      </div>
      <pre>
        <code>{JSON.stringify(questionGroups, null, 4)}</code>
      </pre>
    </AuthWrapper>
  );
}
