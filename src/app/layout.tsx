import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import AppStateProvider from '@/lib/providers/use-state';
import { Toaster } from '@/components/ui/toaster';
import { SupabaseUserProvider } from '@/lib/providers/user-state';
import { ThemeProvider } from '@/components/ThemeProvider';
import { PlayerProvider } from '@/lib/providers/use-player-state';
import ModalProvider from '@/lib/providers/use-modal-state';
import { MobileProvider } from '@/lib/providers/use-mobile-state';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'notesync',
  description: 'Hybrid Music Recommendation and Note-Taking Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn('bg-background dark', inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <AppStateProvider>
            <SupabaseUserProvider>
              <MobileProvider>
                <ModalProvider>
                  <PlayerProvider>{children}</PlayerProvider>
                </ModalProvider>
              </MobileProvider>
            </SupabaseUserProvider>
            <Toaster />
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
