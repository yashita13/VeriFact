import React, { ReactNode } from 'react'
import { isAuthenticated } from "@/lib/action/auth.action";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (isUserAuthenticated) redirect('/analyser');

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Soft brand gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(168,85,247,0.18),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_0%_100%,rgba(236,72,153,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_100%_0%,rgba(6,182,212,0.10),transparent_60%)]" />
      <div className="relative w-full max-w-[620px]">{children}</div>
    </main>
  )
}
export default AuthLayout