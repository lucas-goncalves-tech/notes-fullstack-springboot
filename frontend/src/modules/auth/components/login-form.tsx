'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getMockServerData } from '@/lib/api-server';

// This is the type returned by our mock fetch helper
type MockServerConfig = Awaited<ReturnType<typeof getMockServerData>>;

interface LoginFormProps {
  initialData: MockServerConfig;
}

export function LoginForm({ initialData }: LoginFormProps) {
  // Using React Query with initialData hydrated from the Server Component
  const { data: serverConfig } = useQuery({
    queryKey: ['server-config'],
    queryFn: () => getMockServerData(), // In a real app this would call an API route/endpoint via axios
    initialData,
  });

  return (
    <div className="w-full max-w-[440px] space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-primary/20 p-3 rounded-xl">
          {/* Using a simple SVG for the icon instead of external font to keep it self-contained */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Welcome back
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Enter your details to access your notes
          </p>
          {serverConfig?.status === 'online' && (
            <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
              API Connected
            </span>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-400"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="pl-10 py-5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                htmlFor="password"
              >
                Password
              </label>
              <a
                href="#"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-400"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="pl-10 py-5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="flex items-center">
            {/* Custom styled checkbox to match the provided HTML */}
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-5 w-5 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent transition-colors accent-primary cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-3 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
            >
              Remember me for 30 days
            </label>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full py-6 text-sm font-bold text-background-dark bg-primary hover:brightness-110"
            >
              Sign in to your account
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?
            <a href="#" className="font-bold text-primary hover:underline ml-1">
              Create an account
            </a>
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-6 text-xs text-slate-400 dark:text-slate-500">
        <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">
          Terms of Service
        </a>
        <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">
          Support
        </a>
      </div>
    </div>
  );
}
