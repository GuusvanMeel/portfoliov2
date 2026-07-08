"use client";

import { createClient } from "@/lib/supabase/client";
import { Metadata } from "next";
import { useState } from "react";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  const supabase = createClient();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(formData: FormData) {
    setError(null);
    setIsLoading(true);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setError("Invalid email or password.");
      return;
    }
    window.location.replace("/admin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        action={handleLogin}
        className="w-full max-w-sm bg-[#141414] border border-neutral-800 rounded-xl p-6 flex flex-col gap-4"
      >
        <h1 className="text-xl font-semibold">Admin login</h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-neutral-400">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-neutral-400">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-white disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}