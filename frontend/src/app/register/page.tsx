import { RegisterForm } from '@/modules/auth/components/register-form';

export const metadata = {
  title: 'Criar Conta - NoteMaster',
  description: 'Crie sua conta para começar a usar o NoteMaster',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background">
      <RegisterForm />
    </div>
  );
}
