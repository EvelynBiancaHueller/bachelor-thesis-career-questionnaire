"use client";

import { ReactNode } from "react";

type NonGamifiedFrameProps = {
  children: ReactNode;
};

export function NonGamifiedFrame({ children }: NonGamifiedFrameProps) {
  return (
    <main className="min-h-screen bg-neutral-100">
      <section className="mx-auto flex h-dvh flex-col overflow-hidden w-full max-w-107.5 bg-white px-6 py-8">
        {children}
      </section>
    </main>
  );
}