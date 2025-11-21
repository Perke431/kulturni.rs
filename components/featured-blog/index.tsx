import { Arrow } from '@/svg';
import Image from 'next/image';
import Link from 'next/link';

type featuredEventProps = {
  id: number;
  date: string;
  headline: string;
  link: string;
  image: string;
};

const FeaturedEvent = ({ blog }: { blog: featuredEventProps }) => {
  const { id, date, headline, link, image } = blog;

  return (
    <Link
      href={link}
      className={`
        min-h-[490px] border border-white-20 rounded-xl hover:border-primary p-6 flex flex-col justify-end relative`}
    >
      <Image
        src={image}
        fill
        alt="Kulturni.rs istaknuti dogadjaj"
        className="-z-10"
      />
      <div className="flex flex-col justify-end gap-3">
        <h3 className="mt-auto">{headline}</h3>
        <div className="flex items-center justify-between">
          <p className="text-white">{date}</p>
          <p className="text-primary flex items-center gap-1">
            <span>Pročitaj više</span> <Arrow className="w-4 h-4" />
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedEvent;
