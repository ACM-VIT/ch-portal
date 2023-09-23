import { useRouter } from "next/router";
import AuthWrapper from "@/components/AuthWrapper";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { auth } from "@/lib/firebase";
import QuestionDetails from "@/components/QuestionDetails";

interface Question {
  hint: string | null;
  costOfHint: number | null;
  description: string;
  pointsAwarded: number;
  seq: number;
  title: string;
  images: string[];
  solved: boolean;
}
interface QuestionGroup {
  id: string;
  name: string;
  numberOfQuestions: number;
  description: string;
  isSequence: boolean;
  minimumPhaseScore: number;
  questions: Question[];
}

export default function QuestionGroup() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const { groupId } = router.query;
  const [questionGroupDetails, setQuestionGroupDetails] =
    useState<QuestionGroup>({
      id: "",
      name: "",
      numberOfQuestions: 0,
      description: "",
      isSequence: false,
      minimumPhaseScore: 0,
      questions: [],
    });
  const notify = (message: string) => toast(message);

  const [seq, setSeq] = useState(1);
  const [isSequence, setIsSequence] = useState(false);

  useEffect(() => {
    async function fetchGroup() {
      if (!user) return;
      const backend_url = process.env.NEXT_PUBLIC_API_URL;
      const token = await user.getIdToken();
      const res = await fetch(`${backend_url}/questiongroups/${groupId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data);
      setQuestionGroupDetails(data);
      setSeq(data.questions[data.numQuestionsSolvedQuestionGroup].seq);
      setIsSequence(data.isSequence);
    }

    fetchGroup();
  }, [groupId, user]);

  function handleNext() {
    if (seq == questionGroupDetails.numberOfQuestions) return;
    setSeq(seq + 1);
  }

  function handlePrev() {
    if (seq == 1) return;
    setSeq(seq - 1);
  }

  return (
    <div className="tortia-holder">
      <div className="tortia">
        <AuthWrapper>
          {/* <h1>Question Group {groupId}</h1> */}
          {questionGroupDetails.questions && (
            <QuestionDetails
              questionDetails={
                questionGroupDetails.questions.find(
                  (question) => question.seq == seq
                ) ?? {
                  hint: null,
                  costOfHint: null,
                  description: "",
                  pointsAwarded: 0,
                  seq: 0,
                  title: "",
                  images: [],
                  solved: false,
                }
              }
              questionGroupId={groupId as string}
            />
          )}
          <button onClick={handlePrev} disabled={seq == 1 || isSequence}>
            Prev
          </button>
          <button
            onClick={handleNext}
            disabled={
              seq == questionGroupDetails.numberOfQuestions || isSequence
            }
          >
            Next
          </button>
        </AuthWrapper>
      </div>
    </div>
  );
}
