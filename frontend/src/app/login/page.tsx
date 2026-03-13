import { getMockServerData } from '@/lib/api-server';
import { LoginForm } from '@/modules/auth/components/login-form';

export const metadata = {
  title: 'Login - NotesApp',
  description: 'Sign in to access your notes',
};

export default async function LoginPage() {
  // 1. Fetch data on the Server
  const initialData = await getMockServerData();

  // 2. Pass it as initialData to the Client Component
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background-light dark:bg-background-dark">
      <LoginForm initialData={initialData} />
    </div>
  );
}
