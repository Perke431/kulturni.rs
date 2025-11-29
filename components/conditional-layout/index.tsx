'use client';

import { usePathname } from 'next/navigation';
import { Footer, Header } from '@/components';
import { CTA } from '@/layouts';

export function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <CTA />
      <Footer />
    </>
  );
}

