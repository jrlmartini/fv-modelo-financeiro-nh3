import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Fast Scenario Simulator',
  description: 'Project finance simplified model'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
