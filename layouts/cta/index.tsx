'use client';
import { useState } from 'react';
import { Checkbox, Section } from '@/components';

const CTA = () => {
  const [seeShows, setSeeShows] = useState(true);
  const [seeStandUp, setSeeStandUp] = useState(true);
  const [seeConcerts, setSeeConcerts] = useState(true);

  const handleSeeShows = () => {
    setSeeShows(!seeShows);
  };

  const handleSeeStandup = () => {
    setSeeStandUp(!seeStandUp);
  };

  const handleSeeConcerts = () => {
    setSeeConcerts(!seeConcerts);
  };

  return (
    <Section className="bg-primary text-background py-20 lg:py-24">
      <div className="container text-center">
        <h2 className="max-sm:text-5xl! max-w-[860px] mx-auto">
          Dok svi pričaju o novoj predstavi, stand up-u ili koncertu - ti možeš
          već da znaš gde se to dešava.
        </h2>
        <p>Budi u toku i svake nedelje otkrij šta vredi videti i doživeti.</p>
        <form className="mt-10">
          <div className="flex items-center justify-center gap-10">
            <Checkbox
              label="predstave"
              value={seeShows}
              setValue={handleSeeShows}
            />
            <Checkbox
              label="stand up"
              value={seeStandUp}
              setValue={handleSeeStandup}
            />
            <Checkbox
              label="koncerti"
              value={seeConcerts}
              setValue={handleSeeConcerts}
            />
          </div>
          <div className="max-sm:flex max-sm:flex-col mt-6">
            <input
              type="text"
              placeholder="tvoj@email.com"
              className="outline-0 p-4 rounded-tl-sm max-sm:rounded-tr-sm sm:rounded-bl-sm border border-background max-h-14 min-w-[290px] max-sm:text-center"
            />
            <button
              className="py-4 px-9 bg-background text-primary sm:rounded-tr-sm rounded-br-sm max-sm:rounded-bl-sm cursor-pointer hover:text-text"
              type="submit"
            >
              Želim da budem u toku
            </button>
          </div>
        </form>
      </div>
    </Section>
  );
};

export default CTA;
