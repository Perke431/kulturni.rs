import Link from 'next/link';

const Header = () => {
  return (
    <header className="pt-6">
      <div className="container flex items-center justify-between">
        <Link
          href="/"
          className="logo min-w-[184px]"
        >
          kulturni.rs
        </Link>
        <nav className="flex gap-4">
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
          className="text-primary border border-primary py-3 px-6"
          href="/dogadjaji"
        >
          Uđi u priču - vidi šta sledi
        </Link>
      </div>
    </header>
  );
};

export default Header;
