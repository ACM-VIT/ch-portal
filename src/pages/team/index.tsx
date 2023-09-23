import { auth } from "@/lib/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import owl from "../../../public/owl.png";
import Image from "next/image";

type Page = "default" | "create" | "join";
export default function Team() {
  const [page, setPage] = useState<Page>("default");
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const notify = (message: string) => toast(message);

  useEffect(() => {
    async function asyncFn() {
      if (user !== null && typeof user !== "undefined") {
        const token = await user.getIdToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/teams`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await response.json();
        console.log(json);
        setLoading(false);
        if (json.message === "user not in team") {
          console.log("user not in team");
        } else {
          notify("You are already in a team");
          // wait for 2 seconds
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/home");
        }
      }
    }
    asyncFn();
  }, [user, router]);

  return (
    <div className="bg-neutral-900 h-screen">
      <div className="flex flex-col justify-around items-center gap-3 h-full">
        <div className="flex flex-col justify-between items-center gap-12">
          <h1 className="text-3xl font-bold text-center">
            Welcome to Cryptic Hunt 2.0
          </h1>
        </div>
        <Image src={owl} alt="cute cryptic hunt owl" />
        <div className="w-full">
          {page === "default" && (
            <div className="mx-3">
              <button
                className="bg-orange-400 px-4 py-2 rounded-md text-center w-full"
                onClick={() => {
                  setPage("join");
                }}
              >
                Join Team
              </button>
              <div className="p-2"></div>
              <button
                className="bg-orange-400 px-4 py-2 rounded-md text-center w-full"
                onClick={() => {
                  setPage("create");
                }}
              >
                Create Team
              </button>
            </div>
          )}
          {page === "create" && (
            <div className="mx-3 flex flex-col justify-center items-center gap-3">
              <p className="text-xl font-semibold">
                Make your own fancy team :)
              </p>
              <input
                className="p-2 rounded-md w-full text-black"
                type="text"
                value={teamName}
                onChange={(e) => {
                  setTeamName(e.target.value);
                }}
                placeholder="Team Name"
              />
              <button
                className="bg-orange-400 px-4 py-2 rounded-md text-center w-full"
                onClick={async () => {
                  if (!user || typeof user === "undefined") {
                    notify("You are not logged in");
                    // wait 2 seconds
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    return router.push("/login");
                  }
                  const token = await user.getIdToken();
                  const team = await createTeamRequest(teamName, token);
                  console.log(team);
                  notify(`Team created with join code ${team.teamcode}`);
                  // Wait for 2 seconds
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                  router.push("/home");
                }}
              >
                Create Team
              </button>
              <button onClick={() => setPage("default")}>Back</button>
            </div>
          )}
          {page === "join" && (
            <div className="mx-3 flex flex-col justify-center items-center gap-3">
              <p className="text-xl font-semibold">
                {"Join your favourite team ;)"}
              </p>
              <input
                className="p-2 rounded-md w-full text-black"
                type="text"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value);
                }}
                placeholder="Team Code"
              />
              <button
                className="bg-orange-400 px-4 py-2 rounded-md text-center w-full"
                onClick={async () => {
                  if (!user) {
                    notify("You are not logged in");
                    // wait for 2 seconds
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    return router.push("/login");
                  }
                  const token = await user.getIdToken();
                  const team = await joinTeamRequest(joinCode, token);
                  console.log(team);
                  notify(`Team joined with team name ${team.name}`);
                  // Wait for 2 seconds
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                  router.push("/home");
                }}
              >
                Join Team
              </button>
              <button onClick={() => setPage("default")}>Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface Team {
  id: string;
  name: string;
  teamcode: string;
  teamLeaderId: string;
  createdAt: string;
  updatedAt: string;
  points: number;
}

async function createTeamRequest(
  teamName: string,
  token: string
): Promise<Team> {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL as string;

  // Send a request to create a team
  const res = await fetch(`${backendUrl}/teams/createteam`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ teamname: teamName }),
  });
  const json = (await res.json()) as Team;
  return json;
}

async function joinTeamRequest(joinCode: string, token: string): Promise<Team> {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL as string;

  // Send a request to create a team
  const res = await fetch(`${backendUrl}/teams/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ teamcode: joinCode }),
  });
  const json = (await res.json()) as Team;
  return json;
}
