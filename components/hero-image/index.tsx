import Image from 'next/image';

const HeroImage = ({ inHero }: { inHero?: boolean }) => {
  return (
    <div className="relative w-fit mx-auto">
      <Image
        src="/images/kulturni_rs_hero_slika_mala_levo.jpg"
        width={284}
        height={320}
        className="border-background border-[5px] rounded-xl absolute -left-40 top-20 -rotate-z-10 bg-cover"
        alt="Kulturni.rs hero slika mala"
      />
      <Image
        src="/images/kulturni_rs_hero_slika_velika.jpg"
        width={784}
        height={480}
        alt="Kulturni.rs hero slika"
        className={`${inHero ? '-mt-16' : ''} mx-auto rounded-2xl`}
      />
      <Image
        src="/images/kulturni_rs_hero_slika_mala_desno.jpg"
        width={284}
        height={320}
        className="border-background border-[5px] rounded-xl absolute -right-40 top-[120px] rotate-z-10 bg-cover"
        alt="Kulturni.rs hero slika mala"
      />
    </div>
  );
};

export default HeroImage;
