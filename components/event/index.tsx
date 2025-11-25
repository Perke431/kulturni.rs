import Link from 'next/link';
import Image from 'next/image';
import { Arrow } from '@/svg';

type eventType = {
  id: number;
  date: string;
  text?: string;
  tag: string;
  headline: string;
  link: string;
  image: string;
  isListPage?: boolean;
};

const Event = ({ event }: { event: eventType }) => {
  const { id, tag, date, headline, text, link, image, isListPage } = event;

  return (
    <Link
      href={link}
      className={`
        border border-white-20 rounded-xl hover:border-primary p-4 flex flex-col justify-between relative max-md:min-h-[480px] max-lg:min-h-[400px] ${
          isListPage ? 'min-h-[480px]' : 'min-h-[360px]'
        }`}
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
      <div className="flex flex-col gap-3 text-left">
        <h3 className="h4">{headline}</h3>
        <p>{text}</p>
        <p className="text-primary flex items-center gap-1">
          <span>saznaj više</span> <Arrow className="w-4 h-4" />
        </p>
      </div>
    </Link>
  );
};

export default Event;
