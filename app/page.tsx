import { Blog, Events, FeaturedEvents, Hero, Newsletter } from '@/layouts';

const Home = () => {
  return (
    <main>
      <Hero />
      <FeaturedEvents />
      <Events />
      <Newsletter />
      <Blog />
    </main>
  );
};

export default Home;
