import AuthWrapper from "@/components/AuthWrapper";
import CountdownTimer from "@/components/CountdownTimer";
import { useQuestionGroups } from "@/contexts/questions";
import Link from "next/link";
import style from "./home.module.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import owl from "../../public/owl.png";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

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

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const [questionGroups] = useQuestionGroups();
  const [liveConfigData, setLiveConfigData] =
    useState<LiveConfigResponse | null>(null);

  useEffect(() => {
    const liveConfig = localStorage.getItem("liveConfig");
    if (liveConfig) {
      setLiveConfigData(JSON.parse(liveConfig));
    }
  }, []);

  if (loading || !liveConfigData) {
    return (
      <div className="bg-neutral-900 h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-3xl font-bold">Loading...</p>
          <div className="p-3"></div>
          <p className="text-sm">Your first load can take upto 1 minute</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-900 h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-3xl font-bold">Error: {error.message}</p>
        </div>
      </div>
    );
  }
  return (
    // <div className="tortia-holder">
    //   <div className="tortia">
    //     <AuthWrapper>
    //       <CountdownTimer />
    //       <div className="flex flex-col gap-2 overflow-y-scroll scrollbar-hide">
    //         {questionGroups.map((group) => (
    //           <div className={style.thisClass} key={group.id}>
    //             <Link key={group.id} href={`/questionGroup/${group.id}`}>
    //               <div className="quesdiv">
    //                 <h2 className="qh2">{group.name}</h2>
    //                 <p className="qp">
    //                   {group.numQuestionsSolvedQuestionGroup}/
    //                   {group.numberOfQuestions} solved
    //                 </p>
    //               </div>
    //             </Link>
    //           </div>
    //         ))}
    //       </div>
    //     </AuthWrapper>
    //   </div>
    // </div>

    <>
      <Head>
        <title>Home</title>
      </Head>
      <AuthWrapper>
        <div className="bg-neutral-900 h-screen p-5">
          <div className="flex flex-col justify-around items-center h-full">
            <div>
              <div className="flex flex-row justify-between items-center">
                <h1 className="text-4xl font-bold">Cryptic Hunt 2.0</h1>
                <Image src={owl} alt="cute cryptic hunt owl" />
              </div>
              <div className="flex flex-col gap-5 w-full justify-center">
                <p className="text-xl font-semibold">
                  {liveConfigData.phaseText}
                </p>
                <CountdownTimer />
                <p className="text-xl font-semibold">Questions</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 overflow-y-scroll w-full">
              {questionGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex flex-row justify-between items-center p-3 border rounded-md w-full"
                >
                  <div className="flex flex-col justify-center">
                    <p className="text-md text-white">{group.name}</p>
                    <p className="text-sm text-white/50">
                      {group.numQuestionsSolvedQuestionGroup}/
                      {group.numberOfQuestions} Questions solved
                    </p>
                  </div>

                  <ChevronDoubleRightIcon className="h-6 w-6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </AuthWrapper>
    </>
  );
}
