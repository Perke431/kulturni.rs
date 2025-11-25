import Link from 'next/link';
import { Hamburger } from '@/components';

const Header = () => {
  return (
    <header className="pt-6">
      <div className="container flex items-center justify-between">
        <Link
          href="/"
          className="logo min-w-[184px] z-50"
        >
          kulturni.rs
        </Link>
        <nav className="max-md:hidden flex gap-4">
          <Link
            className="hover:text-primary"
            href="/dogadjaji"
          >
            dogadjaji
          </Link>
          <Link
            className="hover:text-primary"
            href="/blog"
          >
            Blog
          </Link>
          <Link
            className="hover:text-primary"
            href="/kontakt"
          >
            Kontakt
          </Link>
        </nav>
        <Link
          className="max-md:hidden text-primary border border-primary py-3 px-6"
          href="/dogadjaji"
        >
          Uđi u priču - vidi šta sledi
        </Link>
        <Hamburger />
      </div>
    </header>
  );
};

export default Header;
