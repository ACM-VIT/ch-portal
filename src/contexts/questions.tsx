import { auth } from "@/lib/firebase";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthState } from "react-firebase-hooks/auth";

interface QuestionGroup {
  id: string;
  name: string;
  numberOfQuestions: number;
  description: string;
  isSequence: boolean;
  minimumPhaseScore: number;
  numQuestionsSolvedQuestionGroup: number;
}
type QGStorage = QuestionGroup[];
type QuestionContextType = [QGStorage, Dispatch<SetStateAction<QGStorage>>];

export const questionsContext = createContext<QuestionContextType>([
  [],
  () => {},
]);

// {
//   "id": "clmtf2ljt0000izo40cty5gbm",
//   "currentPhase": 1,
//   "changeTrigger": 5,
//   "phaseText": "Phase 1",
//   "mainText": "Tik Tok Tik Tok!",
//   "time": "2023-09-21T16:58:11.994Z",
//   "createdAt": "2023-09-21T16:58:11.994Z",
//   "updatedAt": "2023-09-22T13:37:13.508Z"
// }

interface LiveConfigResponse {
  id: string;
  currentPhase: number;
  changeTrigger: number;
  phaseText: string;
  mainText: string;
  time: string;
  createdAt: string;
  updatedAt: string;
}

async function requestQuestionGroup(idToken: string): Promise<QGStorage> {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL as string;
  const res = await fetch(`${backendUrl}/questiongroups`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });
  const json = (await res.json()) as QGStorage;
  return json;
}

async function requestLiveConfig(idToken: string): Promise<LiveConfigResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL as string;
  const res = await fetch(`${backendUrl}/questiongroups/current-phase`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });
  const json = (await res.json()) as LiveConfigResponse;
  return json;
}

function localLiveConfigData(): LiveConfigResponse | null {
  const storage = localStorage.getItem("liveConfig");
  if (storage) {
    let liveConfig: LiveConfigResponse | null = null;
    try {
      liveConfig = JSON.parse(storage) as LiveConfigResponse;
    } catch (error) {
      console.error(`Error parsing liveConfig: ${error}`);
      localStorage.removeItem("liveConfig");
      return null;
    }
    return liveConfig;
  }
  return null;
}

export function QuestionContextProvider({ children }: { children: ReactNode }) {
  const qgStorage = useState<QGStorage>([]);
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (user !== null) {
      // reading storage on boot
      const storage = localStorage.getItem("questionGroups");
      if (storage) {
        let questions: QGStorage | null = null;
        try {
          questions = JSON.parse(storage) as QGStorage;
        } catch (error) {
          console.error(`Error parsing questionGroups: ${error}`);
          localStorage.removeItem("questionGroups");
        }
        // unlikely scenario to make typescript not yell at me
        if (questions === null) {
          throw new Error(`your mom doesn't love you`);
        }
        qgStorage[1](questions !== null ? questions : []);
      }
    }
    async function system() {
      // make request, compare with local, conditionally update questions
      if (user !== null && typeof user !== "undefined") {
        const idToken = await user.getIdToken();
        const newLiveConfigData = await requestLiveConfig(idToken);
        const oldLiveConfigData = localLiveConfigData();
        if (
          oldLiveConfigData === null ||
          newLiveConfigData.changeTrigger !== oldLiveConfigData.changeTrigger
        ) {
          // update local storage
          localStorage.setItem("liveConfig", JSON.stringify(newLiveConfigData));
          // update questions
          const json = await requestQuestionGroup(idToken);
          qgStorage[1](json);
          // update local storage
          localStorage.setItem("questionGroups", JSON.stringify(json));
          window.location.reload();
        }
      }
    }
    const secondsToWait = 60;
    // starting system interval
    const interval = setInterval(system, secondsToWait * 1000);
    return () => clearInterval(interval);
  }, [user]);
  return (
    <questionsContext.Provider value={qgStorage}>
      {children}
    </questionsContext.Provider>
  );
}

export const useQuestionGroups = () => {
  return useContext(questionsContext);
};
