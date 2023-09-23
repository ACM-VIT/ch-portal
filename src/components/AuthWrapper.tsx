import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { checkWhitelist } from "@/lib/auth";
import { useState, useEffect, ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const [user, firebaseLoading, error] = useAuthState(auth);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [whiteListLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function check() {
      if (!user) return;

      const token = await user.getIdToken();
      const isWhitelisted = await checkWhitelist(token);
      setIsWhitelisted(isWhitelisted);
      setLoading(false);
    }

    check();
  }, [user]);

  if (firebaseLoading) return <p>Checking auth status...</p>;
  if (whiteListLoading) return <p>Checking access(checkin) status...</p>;

  if (error) return <p>Error: {error.message}</p>;

  if (!user) {
    router.push("/login");
    return null;
  }

  return isWhitelisted ? (
    children
  ) : (
    <>
      <button onClick={() => auth.signOut()}>Sign Out</button>
      <p>Sorry, you are not whitelisted.</p>
    </>
  );
}