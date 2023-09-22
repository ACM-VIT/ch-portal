import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { checkWhitelist } from "@/lib/auth";
import { useState, useEffect, ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function check() {
      if (!user) return;

      const token = await user.getIdToken();
      const isWhitelisted = await checkWhitelist(token);
      setIsWhitelisted(isWhitelisted);
    }

    check();
  }, [user]);

  if (loading) return <p>Loading...</p>;

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
