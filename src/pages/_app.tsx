import "@/styles/globals.css";
import { QuestionContextProvider } from "@/contexts/questions";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import "../styles/globals.css";

import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QuestionContextProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </QuestionContextProvider>
  );
}
