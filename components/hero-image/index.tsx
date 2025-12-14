import Image from 'next/image';

const HeroImage = ({ inHero }: { inHero?: boolean }) => {
  return (
    <div className="relative w-fit mx-auto">
      <Image
        src="/images/kulturni_rs_hero_slika_mala_levo.jpg"
        width={284}
        height={320}
        fetchPriority="high"
        className="border-background border-[5px] max-w-[120px] xs:max-w-[160px] rounded-xl absolute left-0 bottom-4 md:top-20 md:-left-20 xl:-left-40 -rotate-z-10 bg-cover md:max-w-[200px] lg:max-w-60 xl:max-w-120"
        alt="Kulturni.rs hero slika mala"
      />
      <Image
        src="/images/kulturni_rs_hero_slika_velika.jpg"
        width={784}
        height={480}
        fetchPriority="high"
        alt="Kulturni.rs hero slika"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 560px, (max-width: 1024px) 680px, 784px"
        className={`${
          inHero ? 'md:-mt-16' : ''
        } mx-auto rounded-lg sm:rounded-2xl md:max-w-[560px] lg:max-w-[680px] xl:max-w-[784px]`}
      />
      <Image
        src="/images/kulturni_rs_hero_slika_mala_desno.jpg"
        width={284}
        height={320}
        fetchPriority="high"
        className="border-background border-[5px] max-w-[120px] xs:max-w-[160px] rounded-xl absolute right-0 bottom-10 md:-right-20 md:top-[120px] xl:-right-40 rotate-z-10 bg-cover md:max-w-[200px] lg:max-w-60 xl:max-w-120"
        alt="Kulturni.rs hero slika mala"
      />
    </div>
  );
};

export default HeroImage;
