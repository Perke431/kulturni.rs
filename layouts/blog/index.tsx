import { Section } from '@/components';
import Link from 'next/link';

const Blog = () => {
  return (
    <Section className="py-24">
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">VODIČ KROZ SCENU</p>
            <h2>
              Kultura se ne traži
              <br /> ovde se nalazi.
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            <p className="max-w-[276px]">
              Kultura se živi - mi smo ti koji je hvataju.Od glavnih bina do
              skrivenih scena, sve što vredi znati čeka ovde, bez pretrage i
              lutanja.
            </p>
            <Link
              className="w-fit py-4 px-9 bg-primary text-background rounded-sm"
              href="#"
            >
              Vidi šta vredi
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Blog;
