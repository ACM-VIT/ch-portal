import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function Index() {
  const [user, loading, error] = useAuthState(auth, {});
  const router = useRouter();

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signin in", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  if (user) {
    router.push("/home");
  }

  return (
    <div>
      <button onClick={signIn}>Sign in with Google</button>
    </div>
  );
}
