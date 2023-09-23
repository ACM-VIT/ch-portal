import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import Image from "next/image";
import owl from "../../public/owl.png";

export default function Index() {
  const [user, loading, error] = useAuthState(auth, {});
  const router = useRouter();

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/team");
    } catch (error) {
      console.error("Error signin in", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-neutral-900 h-screen">
      <div className="flex flex-col justify-center items-center h-full gap-3">
        <p className="text-2xl font-bold">Let the Hunt Begin!</p>
        <div className="text-xl">Web Client for Cryptic Hunt 23</div>
        <Image src={owl} alt="cute cryptic hunt owl" />
        <button
          onClick={signIn}
          className="bg-orange-400 px-4 py-2 rounded-md text-center"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
