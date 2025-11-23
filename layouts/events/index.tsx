import { Event, Section } from '@/components';
import Slider from '@/components/slider';

const Events = () => {
  const events = [
    {
      id: 0,
      date: '11.03.2025',
      tag: 'predstava',
      headline:
        '„Tišina između rečenica“ – nova drama u Srpskom narodnom pozorištu',
      link: '/',
      image: '/images/featured-1.jpg',
    },
    {
      id: 1,
      date: '11.03.2025',
      tag: 'stand up',
      headline: 'Boemski zvuk večeri: Vasil Hadžimanov Bend na Trgu slobode',
      link: '/',
      image: '/images/featured-1.jpg',
    },
    {
      id: 2,
      date: '11.03.2025',
      tag: 'koncert',
      headline:
        'Veče kada Novi Sad staje da se smeje - „Na ivici smeha“ u Domu b612',
      link: '/',
      image: '/images/featured-1.jpg',
    },
    {
      id: 3,
      date: '11.03.2025',
      tag: 'predstava',
      headline:
        '„Tišina između rečenica“ – nova drama u Srpskom narodnom pozorištu',
      link: '/',
      image: '/images/featured-1.jpg',
    },
    {
      id: 4,
      date: '11.03.2025',
      tag: 'stand up',
      headline: 'Boemski zvuk večeri: Vasil Hadžimanov Bend na Trgu slobode',
      link: '/',
      image: '/images/featured-1.jpg',
    },
    {
      id: 5,
      date: '11.03.2025',
      tag: 'koncert',
      headline:
        'Veče kada Novi Sad staje da se smeje - „Na ivici smeha“ u Domu b612',
      link: '/',
      image: '/images/featured-1.jpg',
    },
  ];

  return (
    <Section className="py-20 lg:py-24">
      <div className="container text-center">
        <h2>
          Kultura se živi,
          <br /> <span className="text-primary">ne skroluje</span>.
        </h2>
        <p className="mb-20">
          Izaberi događaj koji te pokreće i postani
          <br /> deo onoga što menja grad.
        </p>
        <Slider
          slides={events.map((x) => (
            <Event
              event={x}
              key={x.id}
            />
          ))}
        />
      </div>
    </Section>
  );
};

export default Events;
