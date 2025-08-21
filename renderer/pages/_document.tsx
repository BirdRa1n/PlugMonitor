import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head />
      <body
        className={clsx(
          `min-h-screen bg-[#F7F8FA] dark:bg-background font-sans antialiased`,
          fontSans.variable,
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
