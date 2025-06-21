"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 font-[family-name:var(--font-geist-sans)]">
            Coming Soon
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-[family-name:var(--font-geist-sans)]">
            Something amazing is on the way. Be the first to know when we launch.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 dark:bg-slate-50 text-slate-50 dark:text-slate-900 py-3 px-6 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-medium"
            >
              Join Waitlist
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-300 font-medium">
                Thank you for joining our waitlist!
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                We'll notify you when we're ready to launch.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
