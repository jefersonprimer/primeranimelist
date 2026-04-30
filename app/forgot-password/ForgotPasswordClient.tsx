"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";

const ForgotPasswordClient = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to send reset code");
      }

      setMessage(data.message || "If this account exists, a code was sent.");
      setShowCodeInput(true);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (verificationCode.length === 6) {
      window.location.href = `/reset-password?email=${encodeURIComponent(email)}&code=${verificationCode}`;
    }
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(digitsOnly);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Reset Password
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {!showCodeInput
              ? "Enter your account email and we will send a 6-digit code."
              : "Enter the 6-digit code sent to your email."}
          </p>
        </div>

        {(error || message) && (
          <div
            className={`p-3 rounded-md text-sm text-center ${
              error
                ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                : "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
            }`}
          >
            {error || message}
          </div>
        )}

        {!showCodeInput ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-800"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {isLoading ? "Sending..." : "Send code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Verification code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                value={verificationCode}
                onChange={handleCodeChange}
                required
                maxLength={6}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-center tracking-[0.35em] text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-800"
                placeholder="000000"
              />
            </div>
            <button
              type="submit"
              disabled={verificationCode.length !== 6}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={() => setShowCodeInput(false)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              Back
            </button>
          </form>
        )}

        <div className="text-center text-sm">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Remembered your password? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordClient;
