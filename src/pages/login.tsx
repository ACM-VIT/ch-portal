import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import owl from "../../public/owl.png";

export default function Index() {
  const [user, loading, error] = useAuthState(auth, {});
  const router = useRouter();

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/home");
    } catch (error) {
      console.error("Error signin in", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="tortia-holder">
      <div className="tortia">
        <div className="t1">Let the Hunt begin!</div>
        <div className="s1">Web client for cryptic hunt 2023</div>
        <br />
        <img src={`/owl.png`} alt="" />
        <div>
          <button onClick={signIn} className="btn">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
