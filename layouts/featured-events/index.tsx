import Link from 'next/link';
import { Section, FeaturedEvent } from '@/components';

const FeaturedEvents = () => {
  const events = [
    {
      id: 0,
      date: '11.03.2025',
      tag: 'predstava',
      headline:
        '„Tišina između rečenica“ – nova drama u Srpskom narodnom pozorištu',
      text: 'Priča o bliskosti, nerazumevanju i vremenu koje menja odnose. Režija potpisuje mlada autorka iz Novog Sada.',
      link: '/',
      image: '/images/featured-1.jpg',
      position: 'left',
    },
    {
      id: 1,
      date: '11.03.2025',
      tag: 'koncert',
      headline: 'Boemski zvuk večeri: Vasil Hadžimanov Bend na Trgu slobode',
      text: 'Jazz, improvizacija i energija koja osvaja. Vasil Hadžimanov Bend donosi magiju urbane muzike pod otvoreno nebo Novog Sada.',
      link: '/',
      image: '/images/featured-2.jpg',
      position: 'center',
    },
    {
      id: 2,
      date: '11.03.2025',
      tag: 'Stand up',
      headline:
        'Veče kada Novi Sad staje da se smeje - „Na ivici smeha“ u Domu b612',
      text: 'Najduhovitiji glasovi domaće stand-up scene dolaze u Novi Sad. Dve večeri humora, improvizacije i prepoznatljivih priča iz svakodnevice.',
      link: '/',
      image: '/images/featured-3.jpg',
      position: 'right',
    },
  ];

  return (
    <Section className="py-24">
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Zastani, pogledaj, doživi.</p>
            <h2>
              jer najbolji događaji se
              <br />
              ne čekaju, oni se hvataju.
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            <p className="max-w-[276px]">
              Ovde su događaji koji pune energijom, pokreću ekipu i prave
              trenutke za pamćenje. Ako tražiš gde se stvarno nešto dešava,
              stigao si na pravo mesto.
            </p>
            <Link
              className="w-fit py-4 px-9 bg-primary text-background rounded-sm"
              href="#"
            >
              Budi prvi koji zna gde i kad!
            </Link>
          </div>
        </div>
        <div className="flex items-end gap-4 mt-20">
          {events.map((x) => (
            <FeaturedEvent
              key={x.id}
              event={x}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default FeaturedEvents;
