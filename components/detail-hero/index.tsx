import Image from 'next/image';
import { Section } from '@/components';

type DetailHeroType = {
  image: string;
  date: string;
  headline: string;
  text: string;
};

const DetailHero = ({ detail }: { detail: DetailHeroType }) => {
  const { image, date, headline, text } = detail;

  return (
    <Section className="relative min-h-[850px] -mt-20 -z-1 border-b border-b-white-20 mb-[100px]">
      <Image
        src={image}
        fill
        className="object-cover -z-1"
        alt="Kulturni.rs slika na detaljnoj strani"
      />
      <div className="container flex flex-col items-start justify-end z-10 min-h-[850px]">
        <div className="max-w-[584px] mb-[100px] flex flex-col gap-4">
          <p className="text-primary">{date}</p>
          <h1 className="h2">{headline}</h1>
          <p>{text}</p>
        </div>
      </div>
    </Section>
  );
};

export default DetailHero;
