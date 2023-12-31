import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="background-div flex min-h-screen w-full items-center justify-end max-sm:justify-center">
      <div className="max-h-screen overflow-y-auto md:absolute md:right-10 md:p-2 md:pr-10">
        {children}
      </div>
    </main>
  );
}
