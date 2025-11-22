import { Blog, Events, FeaturedEvents, Hero, Newsletter } from '@/layouts';

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedEvents />
      <Events />
      <Newsletter />
      <Blog />
    </>
  );
};

export default Home;
