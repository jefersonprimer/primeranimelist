"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const code = searchParams.get("code");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setMessage("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    if (!email || !code) {
      setLocalError("Invalid email or verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setMessage(data.message || "Password reset successful.");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: any) {
      setLocalError(err.message || "Unexpected error.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !code) {
    return (
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Reset Password
        </h1>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-md text-sm text-center">
          Invalid or incomplete reset link. Please request a new code.
        </div>
        <Link
          href="/forgot-password"
          className="block text-center font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          Back to forgot password
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
      <div>
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create New Password
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400 break-all">
          Account: {email}
        </p>
      </div>

      {(localError || message) && (
        <div
          className={`p-3 rounded-md text-sm text-center ${
            localError
              ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
              : "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
          }`}
        >
          {localError || message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            New password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-800"
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Confirm new password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-800"
            placeholder="Repeat your password"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          {showPassword ? "Hide password fields" : "Show password fields"}
        </button>
        <button
          type="submit"
          disabled={isLoading || !password || !confirmPassword}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {isLoading ? "Resetting..." : "Reset password"}
        </button>
      </form>

      <div className="text-center text-sm">
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
