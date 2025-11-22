import Link from 'next/link';
import { Section } from '@/components';
import { Facebook, Instagram } from '@/svg';
import Image from 'next/image';

const Kontakt = () => {
  return (
    <Section className="pt-[100px] pb-[200px]">
      <div className="container flex items-center justify-between">
        <div>
          <h1 className="h2">
            Iza scene ali
            <br /> uvek <span className="text-primary">na vezi</span>.
          </h1>
          <p className="mt-4">
            Imaš predlog, saradnju ili pitanje? Piši nam, podeli ideju
            <br /> ili pošalji vest o događaju koji vredi pažnje.
          </p>
          <div className="my-10 w-fit">
            <Link
              href="mailto:office@kulturni.rs"
              className="hover:text-primary"
            >
              office@kulturni.rs
            </Link>
            <div className="flex items-center gap-3 mt-5">
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
        </div>
        <div className="relative">
          <Image
            src="/images/kulturni_rs_kontakt_slika_velika.jpg"
            alt="Kulturni.rs kontakt slika"
            width={512}
            height={512}
            className="border border-white-20 rounded-xl mr-6"
          />
          <Image
            src="/images/kulturni_rs_kontakt_slika_mala.jpg"
            alt="Kulturni.rs kontakt slika"
            width={320}
            height={284}
            className="border border-white-20 rounded-xl absolute -bottom-12 -right-6"
          />
        </div>
      </div>
    </Section>
  );
};

export default Kontakt;
