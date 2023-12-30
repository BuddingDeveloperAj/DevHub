import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="background-div flex min-h-screen w-full items-center justify-end max-sm:justify-center">
      <div className="right-10 max-h-screen overflow-y-auto md:absolute md:p-2 md:pr-10">
        {children}
      </div>
    </main>
  );
}
