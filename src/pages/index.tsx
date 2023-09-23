import Link from "next/link";

export default function Index() {
  return (
    <div className="bg-neutral-900 h-screen">
      <div className="flex flex-col items-center justify-center mx-5 h-full">
        <div className="bg-orange-400 text-2xl px-4 py-2 rounded-md w-full text-center">
          <Link href="/login">Get started</Link>
        </div>
      </div>
    </div>
  );
}
