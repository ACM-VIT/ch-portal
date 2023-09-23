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

  if (firebaseLoading) {
    return (
      <div className="bg-neutral-900 h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-3xl font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (whiteListLoading) {
    return (
      <div className="bg-neutral-900 h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-3xl font-bold">Checking Auth Status</p>
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

  if (!user) {
    router.push("/login");
    return null;
  }

  return isWhitelisted ? (
    children
  ) : (
    <>
      <div className="bg-neutral-900 h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-3xl font-bold">You have not been whitelisted</p>
        </div>
      </div>
    </>
  );
}
