"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "~/server/auth";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";
  const error = searchParams?.get("error");

  // This will trigger the NextAuth sign-in page
  useEffect(() => {
    // Only redirect to NextAuth sign-in if there's no error
    if (!error) {
      void signIn(undefined, { callbackUrl });
    }
  }, [callbackUrl, error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4">
      <div className="w-full max-w-md rounded-lg bg-white/10 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">Sign In</h1>
        
        {error && (
          <div className="mb-6 rounded bg-red-500/20 p-3 text-center text-sm text-red-200">
            {error === "CredentialsSignin" ? "Invalid credentials" : error}
          </div>
        )}
        
        {/* If there's an error, show option to try again */}
        {error && (
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => signIn(undefined, { callbackUrl })}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        )}
        
        <div className="mt-6 text-center text-sm text-white">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-indigo-300 hover:text-indigo-200">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
} 