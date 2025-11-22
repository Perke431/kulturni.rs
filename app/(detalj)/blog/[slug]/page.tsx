import { DetailHero, FeaturedBlog, Section } from '@/components';

const BlogDetail = () => {
  const detail = {
    image: '/images/detail-image.jpg',
    date: '11.03.2025',
    headline:
      '„Tišina između rečenica“ – nova drama u Srpskom narodnom pozorištu',
    text: 'Priča o bliskosti, nerazumevanju i vremenu koje menja odnose. Režija potpisuje mlada autorka iz Novog Sada, a predstava već puni salu.',
  };
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
    <Section className="pb-[100px]">
      <DetailHero detail={detail} />
      <div className="container">
        <h2>
          ima još <span className="text-primary">zanimljivih</span> priča...
        </h2>
        <div className="grid grid-cols-3 gap-4 mt-10">
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

export default BlogDetail;
