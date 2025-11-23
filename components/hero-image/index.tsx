import Image from 'next/image';

const HeroImage = ({ inHero }: { inHero?: boolean }) => {
  return (
    <div className="relative w-fit mx-auto">
      <Image
        src="/images/kulturni_rs_hero_slika_mala_levo.jpg"
        width={284}
        height={320}
        fetchPriority="high"
        className="border-background border-[5px] max-md:hidden rounded-xl absolute -left-20 xl:-left-40 top-20 -rotate-z-10 bg-cover max-lg:max-w-[200px] max-xl:max-w-60"
        alt="Kulturni.rs hero slika mala"
      />
      <Image
        src="/images/kulturni_rs_hero_slika_velika.jpg"
        width={784}
        height={480}
        fetchPriority="high"
        alt="Kulturni.rs hero slika"
        className={`${
          inHero ? 'md:-mt-16' : ''
        } mx-auto rounded-lg sm:rounded-2xl max-md:max-w-full max-lg:max-w-[560px] max-xl:max-w-[680px]`}
      />
      <Image
        src="/images/kulturni_rs_hero_slika_mala_desno.jpg"
        width={284}
        height={320}
        fetchPriority="high"
        className="border-background border-[5px] max-md:hidden rounded-xl absolute -right-20 xl:-right-40 top-[120px] rotate-z-10 bg-cover max-lg:max-w-[200px] max-xl:max-w-60"
        alt="Kulturni.rs hero slika mala"
      />
    </div>
  );
};

export default HeroImage;
