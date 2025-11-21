'use client';
import { useState } from 'react';
import { Checkbox, HeroImage, Section } from '@/components';

const Newsletter = () => {
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
    <Section className="py-24">
      <div className="container text-center">
        <p className="eyebrow">
          donosimo ti najzanimljivije događaje direktno u inbox.
        </p>
        <h2>Otkrij, isprati, doživi.</h2>
        <form className="mt-10 mb-20">
          <div className="flex items-center justify-center gap-10">
            <Checkbox
              label="predstave"
              value={seeShows}
              setValue={handleSeeShows}
              inverted
            />
            <Checkbox
              label="stand up"
              value={seeStandUp}
              setValue={handleSeeStandup}
              inverted
            />
            <Checkbox
              label="koncerti"
              value={seeConcerts}
              setValue={handleSeeConcerts}
              inverted
            />
          </div>
          <div className="mt-6">
            <input
              type="text"
              placeholder="tvoj@email.com"
              className="outline-0 p-4 rounded-tl-sm rounded-bl-sm border border-primary max-h-14 min-w-[290px]"
            />
            <button
              className="py-4 px-9 bg-primary text-background rounded-tr-sm rounded-br-sm cursor-pointer hover:text-text"
              type="submit"
            >
              Želim da budem u toku
            </button>
          </div>
        </form>
        <HeroImage />
      </div>
    </Section>
  );
};

export default Newsletter;
