import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth, provider } from "@/lib/firebase";

export default function Home() {
  const [user, loading, error] = useAuthState(auth, {});
  const router = useRouter();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  if (!user) {
    router.push("/login");
  }

  return (
    <div>
      <p>Home</p>
    </div>
  );
}
