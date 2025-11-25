import { Arrow } from '@/svg';
import Image from 'next/image';
import Link from 'next/link';

type featuredEventProps = {
  id: number;
  date: string;
  tag: string;
  headline: string;
  text: string;
  link: string;
  image: string;
  position: string;
};

const FeaturedEvent = ({ event }: { event: featuredEventProps }) => {
  const { id, date, tag, headline, text, link, image, position } = event;

  return (
    <Link
      href={link}
      className={`
        ${position === 'left' ? 'h-[480px] w-[334px]' : ''} 
        ${position === 'center' ? 'h-[520px] w-[484px]' : ''} 
        ${position === 'right' ? 'h-[440px] w-[334px]' : ''} 
        border border-white-20 rounded-xl hover:border-primary p-6 flex flex-col justify-between relative`}
    >
      <Image
        src={image}
        fill
        alt="Kulturni.rs istaknuti dogadjaj"
        className="-z-10 object-cover"
      />
      <div className="flex items-center justify-between">
        <p className="bg-white-20 px-3 py-1 text-white rounded-sm">{date}</p>
        <p className="bg-primary px-3 py-1 text-background rounded-sm">{tag}</p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="h4">{headline}</h3>
        <p>{text}</p>
        <p className="text-primary flex items-center gap-1">
          <span>saznaj više</span> <Arrow className="w-4 h-4" />
        </p>
      </div>
    </Link>
  );
};

export default FeaturedEvent;
