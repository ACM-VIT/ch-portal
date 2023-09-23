import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { toast } from "react-toastify";

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

export default function QuestionDetails({ questionDetails, questionGroupId }: { questionDetails: Question, questionGroupId: string }) {
  const [user, loading, error] = useAuthState(auth);
  const [answer, setAnswer] = useState("");
  const {
    hint,
    costOfHint,
    description,
    pointsAwarded,
    seq,
    title,
    images,
    solved,
  } = questionDetails;
  const notify = (message: string) => toast(message);

  async function buyHint() {
    if (!user) return;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = await user.getIdToken();
    const response = await fetch(`${backendUrl}/submissions/buyhint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questionGroupId, seq }),
    });
    const data = await response.json();

    console.log(data);
  }

  async function handleSolve() {
    if (!user) return;
    if (answer === "") return notify("Please enter an answer");
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = await user.getIdToken();
    const response = await fetch(`${backendUrl}/submissions/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        answer,
        questionGroupId,
        seq: seq,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.isCorrect) {
      notify("Correct answer");
      // Wait for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.reload();
    } else {
      notify("Incorrect answer");
    }
  }

  return (
    <div className="question-details">
      {solved ? (
        <div className="question-details__solved">Solved</div>
      ) : (
        <>
          <div className="question-details__title">{title}</div>
          <div className="question-details__description">{description}</div>
          <div className="question-details__hint">{hint}</div>
          <div className="question-details__cost-of-hint">{costOfHint}</div>
          <div className="question-details__points-awarded">
            {pointsAwarded}
          </div>
          <div className="question-details__seq">{seq}</div>
          {images.map((image) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="question" key={image} />
          ))}

          <div>
            Buy hint
            <button onClick={buyHint}>Buy</button>
          </div>

          <input
            type="text"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button onClick={handleSolve}>Solve</button>
        </>
      )}
    </div>
  );
}
