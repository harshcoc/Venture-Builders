import { Metadata } from 'next';
import LoginPageClient from './LoginPageClient';

export const metadata: Metadata = {
  title: 'Login | Admin Dashboard',
  description: 'Sign in to the Admin Dashboard to manage users and products.',
};

export default function LoginPage() {
  return <LoginPageClient />;
}
