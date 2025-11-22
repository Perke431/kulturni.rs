import { Event, Section } from '@/components';

const Dogadjaji = () => {
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
    {
      id: 3,
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
      id: 4,
      date: '11.03.2025',
      tag: 'stand up',
      text: 'Priča o bliskosti, nerazumevanju i vremenu koje menja odnose. Režija potpisuje mlada autorka iz Novog Sada, a predstava već puni salu.',
      headline: 'Boemski zvuk večeri: Vasil Hadžimanov Bend na Trgu slobode',
      link: '/',
      image: '/images/featured-1.jpg',
      isListPage: true,
    },
    {
      id: 5,
      date: '11.03.2025',
      tag: 'koncert',
      text: 'Priča o bliskosti, nerazumevanju i vremenu koje menja odnose. Režija potpisuje mlada autorka iz Novog Sada, a predstava već puni salu.',
      headline:
        'Veče kada Novi Sad staje da se smeje - „Na ivici smeha“ u Domu b612',
      link: '/',
      image: '/images/featured-1.jpg',
      isListPage: true,
    },
    {
      id: 6,
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
      id: 7,
      date: '11.03.2025',
      tag: 'stand up',
      text: 'Priča o bliskosti, nerazumevanju i vremenu koje menja odnose. Režija potpisuje mlada autorka iz Novog Sada, a predstava već puni salu.',
      headline: 'Boemski zvuk večeri: Vasil Hadžimanov Bend na Trgu slobode',
      link: '/',
      image: '/images/featured-1.jpg',
      isListPage: true,
    },
    {
      id: 8,
      date: '11.03.2025',
      tag: 'stand up',
      text: 'Priča o bliskosti, nerazumevanju i vremenu koje menja odnose. Režija potpisuje mlada autorka iz Novog Sada, a predstava već puni salu.',
      headline: 'Boemski zvuk večeri: Vasil Hadžimanov Bend na Trgu slobode',
      link: '/',
      image: '/images/featured-1.jpg',
      isListPage: true,
    },
  ];

  return (
    <Section className="py-[100px]">
      <div className="container text-center">
        <p className="eyebrow text-primary">KULTURNI RITAM GRADA</p>
        <h2>
          Svaki dan ima
          <br /> svoju <span className="text-primary">scenu</span>.
        </h2>
        <p className="mb-20">
          Pronađi događaje koji vrede tvog vremena <br /> izabrani, ažurni i u
          ritmu onoga što se upravo dešava.
        </p>
        <div></div>
        <div className="grid grid-cols-3 gap-4">
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

export default Dogadjaji;
