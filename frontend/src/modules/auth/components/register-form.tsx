'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerUser } from '@/modules/auth/services/auth-api';
import { toast } from 'sonner';
import axios from 'axios';

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const displayName = formData.get('displayName') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('As senhas devem ser iguais!');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await registerUser({ email, displayName, password, confirmPassword });
      toast.success(result.message || 'Conta criada com sucesso!');
      router.push('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Erro ao criar conta.');
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
            Criar conta
          </h1>
          <p className="text-muted-foreground text-base">
            Preencha os dados para começar a usar o NoteMaster
          </p>
        </div>
      </div>

      <div className="bg-card text-card-foreground p-8 rounded-xl border border-border shadow-sm">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-foreground"
              htmlFor="displayName"
            >
              Nome
            </label>
            <Input
              id="displayName"
              name="displayName"
              type="text"
              placeholder="Seu nome"
              required
              minLength={3}
              className="py-5 bg-background border-input"
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-foreground"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nome@exemplo.com"
              required
              className="py-5 bg-background border-input"
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-foreground"
              htmlFor="password"
            >
              Senha
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              className="py-5 bg-background border-input"
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-foreground"
              htmlFor="confirmPassword"
            >
              Confirmar Senha
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              className="py-5 bg-background border-input"
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-sm font-bold text-primary-foreground bg-primary hover:brightness-110 disabled:opacity-50"
            >
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?
            <a href="/login" className="font-bold text-primary hover:underline ml-1">
              Entrar
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
