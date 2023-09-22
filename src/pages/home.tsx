import AuthWrapper from "@/components/AuthWrapper";

export default function Home() {
  return (
    <AuthWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-6xl font-bold">Welcome to the Next.js Starter</h1>
      </div>
    </AuthWrapper>
  );
}
