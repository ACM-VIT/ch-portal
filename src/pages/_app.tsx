import { QuestionContextProvider } from "@/contexts/questions";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QuestionContextProvider>
      <Component {...pageProps} />
    </QuestionContextProvider>
  );
}
