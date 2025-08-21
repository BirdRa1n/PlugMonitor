import { Head } from "./head";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-full w-full">
      <Head />
      <main className="">
        {children}
      </main>
    </div>
  );
}
