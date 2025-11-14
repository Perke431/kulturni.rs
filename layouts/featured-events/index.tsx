import { Section } from '@/components';
import Link from 'next/link';

const FeaturedEvents = () => {
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
      </div>
    </Section>
  );
};

export default FeaturedEvents;
