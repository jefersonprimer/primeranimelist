"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Join PrimerAnimeList and start tracking
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Full Name
              </label>
              <input
                id="full-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="relative block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-800"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-800"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" title="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all active:scale-95"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Already have an account? </span>
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
