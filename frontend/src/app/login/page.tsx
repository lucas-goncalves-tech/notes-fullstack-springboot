import { LoginForm } from '@/modules/auth/components/login-form';

export const metadata = {
  title: 'Login - NoteMaster',
  description: 'Entre para acessar suas notas',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background">
      <LoginForm />
    </div>
  );
}
