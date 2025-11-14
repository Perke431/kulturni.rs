import { Facebook, Instagram } from '@/svg';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center text-center py-10">
      <Link
        href="/"
        className="logo min-w-[182px]"
      >
        kulturni.rs
      </Link>
      <div className="my-10">
        <Link
          href="mailto:office@kulturni.rs"
          className="hover:text-primary"
        >
          office@kulturni.rs
        </Link>
        <div className="flex items-center justify-center gap-3 mt-5">
          <Link
            href="https://www.instagram.com/kulturni.novisad/"
            className="group"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4 group-hover:text-primary" />
          </Link>
          <Link
            href="https://www.instagram.com/kulturni.novisad/"
            aria-label="Instagram"
            className="group"
          >
            <Instagram className="w-4 h-4 group-hover:text-primary" />
          </Link>
        </div>
      </div>
      <div>
        <p>© {new Date().getFullYear()} Kulturni.rs - Sva prava zadrzana.</p>
        <p>
          Designed and developed by{' '}
          <Link
            className="text-primary"
            href="https://devdad.me"
          >
            devdad
          </Link>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
