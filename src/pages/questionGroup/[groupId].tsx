import { useRouter } from "next/router";
import AuthWrapper from "@/components/AuthWrapper";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { auth } from "@/lib/firebase";
import QuestionDetails from "@/components/QuestionDetails";

export default function QuestionGroup() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const { groupId } = router.query;
  const [questionGroupDetails, setQuestionGroupDetails] = useState({});
  const notify = (message) => toast(message);

  const [seq, setSeq] = useState(1);

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
      setQuestionGroupDetails(data);
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
    <AuthWrapper>
      <h1>Question Group {groupId}</h1>
      <button onClick={handlePrev} disabled={seq == 1}>
        Prev
      </button>
      {questionGroupDetails.questions && (
        <QuestionDetails
          questionDetails={questionGroupDetails.questions.find(
            (question) => question.seq == seq,
          )}
          questionGroupId={groupId}
        />
      )}
      <button
        onClick={handleNext}
        disabled={seq == questionGroupDetails.numberOfQuestions}
      >
        Next
      </button>
    </AuthWrapper>
  );
}
