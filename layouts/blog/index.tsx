import Link from 'next/link';
import { FeaturedBlog, Section } from '@/components';

const Blog = () => {
  const blogs = [
    {
      id: 0,
      image: '/images/blog-1.jpg',
      headline: 'Vikend vodič: gde ovog puta ide Novi Sad?',
      date: '11.03.2025',
      link: '/',
    },
    {
      id: 1,
      image: '/images/blog-2.jpg',
      headline: 'Pet prostora koji su promenili kulturnu mapu Novog Sada',
      date: '11.03.2025',
      link: '/',
    },
    {
      id: 2,
      image: '/images/blog-3.jpg',
      headline: 'Šta Novi Sad radi posle osam?',
      date: '11.03.2025',
      link: '/',
    },
  ];

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
        <div className="grid grid-cols-3 gap-4 mt-20">
          {blogs.map((x) => (
            <FeaturedBlog
              key={x.id}
              blog={x}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Blog;
