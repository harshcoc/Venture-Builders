import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from '@/theme/ThemeRegistry';
import SnackbarNotification from '@/components/common/SnackbarNotification';
import NextAuthSessionProvider from '@/components/auth/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description:
    'Production-quality admin dashboard for managing users and products.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}
      >
        <NextAuthSessionProvider>
          <ThemeRegistry>
            {children}
            <SnackbarNotification />
          </ThemeRegistry>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
