'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/providers/auth-provider';
import { loginUser } from '@/modules/auth/services/auth-api';
import { toast } from 'sonner';
import axios from 'axios';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await loginUser({ email, password });
      await login(result.token);
      toast.success(result.message || 'Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Falha no login.');
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const err = error as { response: { data: { message?: string } } };
        toast.error(err.response?.data?.message || 'Falha no login.');
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-[440px] space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-primary/20 p-3 rounded-xl">
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
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Bem-vindo de volta
          </h1>
          <p className="text-muted-foreground text-base">
            Entre com suas credenciais para acessar suas notas
          </p>
        </div>
      </div>

      <div className="bg-card text-card-foreground p-8 rounded-xl border border-border shadow-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-foreground"
              htmlFor="email"
            >
              Email
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
                  className="text-muted-foreground"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nome@exemplo.com"
                required
                className="pl-10 py-5 bg-background border-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                className="block text-sm font-semibold text-foreground"
                htmlFor="password"
              >
                Senha
              </label>
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
                  className="text-muted-foreground"
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
                minLength={8}
                className="pl-10 py-5 bg-background border-input"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-sm font-bold text-primary-foreground bg-primary hover:brightness-110 disabled:opacity-50"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar na sua conta'}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?
            <a href="/register" className="font-bold text-primary hover:underline ml-1">
              Criar conta
            </a>
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-6 text-xs text-muted-foreground">
        <span>NoteMaster © 2024</span>
      </div>
    </div>
  );
}
