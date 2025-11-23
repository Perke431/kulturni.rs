import Link from 'next/link';
import { HeroImage, Section } from '@/components';

const Hero = () => {
  return (
    <Section className="py-20 lg:py-24 text-center">
      <div className="container">
        <h1 className="relative z-10 max-md:mb-6">
          Kultura <span className="text-primary">živi</span> <br />u svakom
          uglu.
        </h1>
        <HeroImage inHero />
        <div className="flex flex-col md:flex-row items-center justify-between max-w-[784px] mx-auto mt-6 md:mt-12">
          <p className="text-center mb-6 md:mb-0 md:text-left">
            Sve što čini grad živim - koncerti, predstave i stand up
            <br /> koji pretvaraju obične večeri u doživljaje.
          </p>
          <Link
            className="py-4 px-9 bg-primary text-background rounded-sm"
            href="#"
          >
            Budi prvi koji zna gde i kad!
          </Link>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
