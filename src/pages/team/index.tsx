import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type Page = "default" | "create" | "join";
export default function Team() {
  const [page, setPage] = useState<Page>("default");
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
        if (json.teamId !== null) {
          alert("You are already in a team!");
          window.location.href = "/team";
        }
      }
    }
    asyncFn();
  }, [user]);

  return (
    <div>
      <h1>Cryptic Hunt</h1>
      <div>
        {page === "default" && (
          <>
            <button
              onClick={() => {
                setPage("join");
              }}
            >{`Join Team`}</button>
            <button
              onClick={() => {
                setPage("create");
              }}
            >{`Create Team`}</button>
          </>
        )}
        {page === "create" && (
          <div>
            <div>{`Create Team`}</div>
            <input
              type="text"
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
              }}
              placeholder="Team Name"
            />
            <button
              onClick={async () => {
                if (!user || typeof user === "undefined")
                  return alert(
                    "You are not logged in. please go to /login page"
                  );
                const token = await user.getIdToken();
                const team = await createTeamRequest(teamName, token);
                console.log(team);
                alert(`Team created with join code ${team.teamcode}`);
              }}
            >{`Create Team`}</button>
          </div>
        )}
        {page === "join" && (
          <div>
            <div>{`Join Team`}</div>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => {
                setJoinCode(e.target.value);
              }}
              placeholder="Team Join Code"
            />
            <button
              onClick={async () => {
                if (!user) {
                  return alert(
                    "You are not logged in. please go to /login page"
                  );
                }
                const token = await user.getIdToken();
                const team = await joinTeamRequest(joinCode, token);
              }}
            >{`Join Team`}</button>
          </div>
        )}
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
  const res = await fetch(`${backendUrl}/teams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
