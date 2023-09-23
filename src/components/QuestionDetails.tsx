import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import styles from "./questions.module.css";

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

export default function QuestionDetails({
  questionDetails,
  questionGroupId,
}: {
  questionDetails: Question;
  questionGroupId: string;
}) {
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
  const router = useRouter();
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

    if (data.message && data.message === "Question does not have a hint") {
      notify("Question does not have a hint");
    } else {
      notify("Hint bought");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.reload();
    }

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
      const res2 = await fetch(`${backendUrl}/questiongroups`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const json = await res2.json();

      localStorage.setItem("questionGroups", JSON.stringify(json));

      const currentQuestionGroup = json.find(
        (questionGroup: any) => questionGroup.id === questionGroupId
      );

      if (!currentQuestionGroup) {
        router.push("/home");
      }
      // Wait for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.reload();
    } else {
      notify("Incorrect answer");
    }
  }

  // ... [the rest of your imports and functions remain unchanged]

  return (
    <div className={styles.tortia2}>
      <header className={styles.title}>{title}</header>

      <article className={styles.description}>
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadsdgfsfsdf
        dsdfsdfsdfsdf sd fsdfsdfsdffdgsdfgdsfgdsffg sdfsdfsdfdsf sdfsdfsdfdsf
        sdfsdfsdfsdf Lorem ipsum dolor sit amet consectetur adipisicing elit. At
        dolorem ex quisquam nihil qui recusandae excepturi necessitatibus.
        Laudantium, ab ipsa omnis praesentium voluptatem quam labore, repellat
        quia nisi, magnam quo?{description}
      </article>

      <section className={styles.info_section}>
        <div>
          <strong>Hint:</strong>
          <span className={styles.info}>{hint}</span>
        </div>
        <div>
          <strong>Cost:</strong>
          <span className={styles.info}>{costOfHint}</span>
        </div>
        <div>
          <strong>Points:</strong>
          <span className={styles.info}>{pointsAwarded}</span>
        </div>
        <div>
          <strong>Part:</strong>
          <span className={styles.info}>{seq}</span>
        </div>
      </section>

      <section className={styles.action_section}>
        <input
          type="text"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className={styles.answer_input}
        />
        <button className={styles.action_btn} onClick={handleSolve}>
          ✅ Solve
        </button>
        <button className={styles.hint_btn} onClick={buyHint}>
          💡 Buy Hint
        </button>
      </section>
    </div>
  );
}
