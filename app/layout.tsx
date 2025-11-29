import type { Metadata } from 'next';
import { Bebas_Neue, EB_Garamond } from 'next/font/google';
import './globals.css';
import { ConditionalLayout } from '@/components/conditional-layout';

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas',
  weight: '400',
});

const ebGaramond = EB_Garamond({
  variable: '--font-garamond',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Kulturni.rs',
  description: 'Kulturni.rs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${ebGaramond.variable} antialiased`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
