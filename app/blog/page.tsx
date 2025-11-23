import { FeaturedBlog, Section } from '@/components';

const Blog = () => {
  const blogs = [
    {
      id: 0,
      image: '/images/blog-1.jpg',
      headline: 'Vikend vodič: gde ovog puta ide Novi Sad?',
      date: '11.03.2025',
      tag: 'Najnovije',
      link: '/',
    },
    {
      id: 1,
      image: '/images/blog-2.jpg',
      headline: 'Pet prostora koji su promenili kulturnu mapu Novog Sada',
      date: '11.03.2025',
      tag: 'najčitanije',
      link: '/',
    },
    {
      id: 2,
      image: '/images/blog-3.jpg',
      headline: 'Šta Novi Sad radi posle osam?',
      date: '11.03.2025',
      tag: 'Izdvojeno',
      link: '/',
    },
    {
      id: 3,
      image: '/images/blog-1.jpg',
      headline: 'Vikend vodič: gde ovog puta ide Novi Sad?',
      date: '11.03.2025',
      tag: 'Vodič',
      link: '/',
    },
    {
      id: 4,
      image: '/images/blog-2.jpg',
      headline: 'Pet prostora koji su promenili kulturnu mapu Novog Sada',
      date: '11.03.2025',
      tag: 'Razgovor',
      link: '/',
    },
    {
      id: 5,
      image: '/images/blog-3.jpg',
      headline: 'Šta Novi Sad radi posle osam?',
      date: '11.03.2025',
      tag: 'Izdvojeno',
      link: '/',
    },
    {
      id: 6,
      image: '/images/blog-1.jpg',
      headline: 'Vikend vodič: gde ovog puta ide Novi Sad?',
      date: '11.03.2025',
      tag: 'Izdvojeno',
      link: '/',
    },
    {
      id: 7,
      image: '/images/blog-2.jpg',
      headline: 'Pet prostora koji su promenili kulturnu mapu Novog Sada',
      date: '11.03.2025',
      tag: 'Izdvojeno',
      link: '/',
    },
    {
      id: 8,
      image: '/images/blog-3.jpg',
      headline: 'Šta Novi Sad radi posle osam?',
      date: '11.03.2025',
      tag: 'Izdvojeno',
      link: '/',
    },
  ];

  return (
    <Section className="py-20 lg:py-24">
      <div className="container text-center">
        <p className="eyebrow text-primary">IZA SCENE</p>
        <h2>
          Ovde kultura priča
          <br /> svojim <span className="text-primary">glasom</span>.
        </h2>
        <p className="mb-20">
          priče iza scene, Izdvojeno od nas i Vodiči kroz scenu - <br /> pogled
          iznutra na ono što oblikuje našu kulturu.
        </p>
        <div></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
