import { useRouter } from "next/router";
import AuthWrapper from "@/components/AuthWrapper";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { auth } from "@/lib/firebase";
import QuestionDetails from "@/components/QuestionDetails";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Head from "next/head";

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

  function back() {
    router.push("/home");
  }

  return (
    <>
      <Head>
        <title>Question Group</title>
      </Head>

      <AuthWrapper>
        <div className="bg-neutral-900 h-screen p-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center gap-5">
              <ChevronLeftIcon className="h-6 w-6" onClick={() => back()} />
              <p className="text-2xl font-bold">{questionGroupDetails.name}</p>
            </div>
            <hr />
            <div className="flex flex-row justify-between">
              <button
                onClick={handlePrev}
                disabled={seq == 1 || isSequence}
                className="disabled:text-white/25"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <p className="text-2xl font-bold">{seq}</p>
              <button
                onClick={handleNext}
                className="disabled:text-white/25"
                disabled={
                  seq == questionGroupDetails.numberOfQuestions || isSequence
                }
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>
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
          </div>
        </div>
      </AuthWrapper>
    </>
  );
}
