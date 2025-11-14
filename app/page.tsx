import { Blog, CTA, Events, FeaturedEvents, Hero, Newsletter } from '@/layouts';

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedEvents />
      <Events />
      <Newsletter />
      <Blog />
      <CTA />
    </>
  );
};

export default Home;
