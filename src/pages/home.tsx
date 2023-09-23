import AuthWrapper from "@/components/AuthWrapper";
import CountdownTimer from "@/components/CountdownTimer";
import { useQuestionGroups } from "@/contexts/questions";
import Link from "next/link";
import style from "./home.module.css";

export default function Home() {
  const [questionGroups] = useQuestionGroups();
  if (!questionGroups) {
    return <div>loading...</div>;
  }
  return (
    <div className="tortia-holder">
      <div className="tortia">
        <AuthWrapper>
          <CountdownTimer />
          <div className="flex flex-col gap-2 overflow-y-scroll scrollbar-hide">
            {questionGroups.map((group) => (
              <div className={style.thisClass} key={group.id}>
                <Link key={group.id} href={`/questionGroup/${group.id}`}>
                  <div className="quesdiv">
                    <h2 className="qh2">{group.name}</h2>
                    <p className="qp">
                      {group.numQuestionsSolvedQuestionGroup}/
                      {group.numberOfQuestions} solved
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </AuthWrapper>
      </div>
    </div>
  );
}
