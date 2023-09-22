import AuthWrapper from "@/components/AuthWrapper";
import CountdownTimer from "@/components/CountdownTimer";
import { useQuestionGroups } from "@/contexts/questions";
import Link from "next/link";

export default function Home() {
  const [questionGroups] = useQuestionGroups();
  return (
    <AuthWrapper>
      <CountdownTimer />
      {questionGroups.map((group) => (
        <Link key={group.id} href={`/questionGroup/${group.id}`}>
          <div>
            <h2>{group.name}</h2>
            <p>
              {group.numQuestionsSolvedQuestionGroup}/{group.numberOfQuestions}{" "}
              questions solved
            </p>
          </div>
        </Link>
      ))}
    </AuthWrapper>
  );
}
