'use client';

import Link from 'next/link';
import { useState } from 'react';

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle('overflow-hidden');
  };

  return (
    <div className="md:hidden">
      <button
        onClick={handleIsOpen}
        className="flex flex-col gap-2 cursor-pointer z-50 relative"
      >
        <div
          className={`${
            isOpen ? 'rotate-45 translate-y-1.5' : ''
          } w-8 h-[3px] bg-primary transition-all`}
        ></div>
        <div
          className={`${isOpen ? 'hidden' : ''} w-8 h-[3px] bg-primary`}
        ></div>
        <div
          className={`${
            isOpen ? '-rotate-45 -translate-y-1.5' : ''
          } w-8 h-[3px] bg-primary transition-all`}
        ></div>
      </button>
      <div
        className={`${
          !isOpen ? '-top-full' : 'top-0'
        } fixed bg-background w-full h-screen z-40 flex flex-col items-center justify-center left-0 right-0 transition-all`}
      >
        <nav className="flex flex-col items-center gap-4 mb-10">
          <Link
            className="hover:text-primary"
            href="/dogadjaji"
            onClick={handleIsOpen}
          >
            dogadjaji
          </Link>
          <Link
            className="hover:text-primary"
            href="/blog"
            onClick={handleIsOpen}
          >
            Blog
          </Link>
          <Link
            className="hover:text-primary"
            href="/kontakt"
            onClick={handleIsOpen}
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
    </div>
  );
};

export default Hamburger;
