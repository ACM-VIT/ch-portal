import { auth } from "@/lib/firebase";
import { Dialog, Transition } from "@headlessui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, Fragment } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import SmartDescription from "./SmartDescription";
import {
  PaperAirplaneIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

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
  const [isOpen, setIsOpen] = useState(false);
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

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

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

    if (data.message) {
      notify(data.message);
      closeModal();
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
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {hint ? "Hint" : "Are you sure"}
                  </Dialog.Title>
                  <div className="mt-2">
                    {hint ? (
                      <p className="text-sm text-gray-500">{hint}</p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {costOfHint} points will be deducted on taking the hint,
                        are you sure you wanna take the hint!!!
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    {hint ? (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={buyHint}
                      >
                        Take Hint
                      </button>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="bg-neutral-900">
        <div className="flex flex-col gap-9">
          <div>
            <p className="text-3xl font-bold">{title}</p>
            <p className="text-md text-white/50">{pointsAwarded} Points</p>
          </div>

          <div className="max-h-96 overflow-y-scroll font-semibold overflow-x-clip">
            {/* <SmartDescription text="Visit https://example.com for more info.\nAlso, check out:\nhttps://openai.com!" /> */}
            <SmartDescription text={description} />
            {images.map((image) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={image} src={image} alt="" />
            ))}
          </div>

          {costOfHint && (
            <div className="flex flex-col justify-center items-center">
              <button
                className="flex flex-row gap-2 justify-center items-center"
                onClick={openModal}
              >
                <QuestionMarkCircleIcon className="h-6 w-6 text-red-600" />
                hint
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="answer">Enter Text</label>
            <div className="flex flex-row gap-1 w-full">
              <input
                type="text"
                name="answer"
                value={answer}
                className="p-2 rounded-md text-black w-2/3"
                onChange={(e) => setAnswer(e.target.value)}
              />
              <button
                onClick={handleSolve}
                className="flex flex-row justify-center items-center bg-red-700 rounded-md w-1/3"
              >
                <PaperAirplaneIcon className="h-full w-7" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
