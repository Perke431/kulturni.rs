import { DetailHero, Event, Section } from '@/components';

const EventDetail = () => {
  const detail = {
    image: '/images/detail-image.jpg',
    date: '11.03.2025',
    headline:
      '„Tišina između rečenica“ – nova drama u Srpskom narodnom pozorištu',
    text: 'Priča o bliskosti, nerazumevanju i vremenu koje menja odnose. Režija potpisuje mlada autorka iz Novog Sada, a predstava već puni salu.',
  };

  const events = [
    {
      id: 0,
      date: '11.03.2025',
      tag: 'predstava',
      text: 'Priča o bliskosti, nerazumevanju i vremenu koje menja odnose. Režija potpisuje mlada autorka iz Novog Sada, a predstava već puni salu.',
      headline:
        '„Tišina između rečenica“ – nova drama u Srpskom narodnom pozorištu',
      link: '/',
      image: '/images/featured-1.jpg',
      isListPage: true,
    },
    {
      id: 1,
      date: '11.03.2025',
      tag: 'stand up',
      text: 'Priča o bliskosti, nerazumevanju i vremenu koje menja odnose. Režija potpisuje mlada autorka iz Novog Sada, a predstava već puni salu.',
      headline: 'Boemski zvuk večeri: Vasil Hadžimanov Bend na Trgu slobode',
      link: '/',
      image: '/images/featured-1.jpg',
      isListPage: true,
    },
    {
      id: 2,
      date: '11.03.2025',
      tag: 'koncert',
      text: 'Priča o bliskosti, nerazumevanju i vremenu koje menja odnose. Režija potpisuje mlada autorka iz Novog Sada, a predstava već puni salu.',
      headline:
        'Veče kada Novi Sad staje da se smeje - „Na ivici smeha“ u Domu b612',
      link: '/',
      image: '/images/featured-1.jpg',
      isListPage: true,
    },
  ];
  return (
    <Section className="pb-[100px]">
      <DetailHero detail={detail} />
      <div className="container">
        <h2>
          Još iz <span className="text-primary">kulturnog</span> kalendara...
        </h2>
        <div className="grid grid-cols-3 gap-4 mt-10">
          {events.map((x) => (
            <Event
              key={x.id}
              event={x}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default EventDetail;
