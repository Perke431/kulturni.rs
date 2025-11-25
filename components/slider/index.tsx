'use client';

import { ReactNode, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { Arrow } from '@/svg';

const Slider = ({
  slides,
  showButtons,
}: {
  slides: ReactNode[];
  showButtons: boolean;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div
      className="embla"
      ref={emblaRef}
    >
      <div className="embla__container">
        {slides.map((x, index) => (
          <div
            className="embla__slide"
            key={index}
          >
            {x}
          </div>
        ))}
      </div>
      {showButtons && (
        <div className="flex items-center justify-between mt-10">
          <div className="flex items-center gap-4">
            <button
              className="embla__prev cursor-pointer text-primary w-12 h-12 flex items-center justify-center border border-primary rounded-full"
              onClick={scrollPrev}
            >
              <Arrow className="w-4 h-4 rotate-z-180" />
            </button>
            <button
              className="embla__next cursor-pointer text-primary w-12 h-12 flex items-center justify-center border border-primary rounded-full"
              onClick={scrollNext}
            >
              <Arrow className="w-4 h-4" />
            </button>
          </div>
          <Link
            href="/dogadjaji"
            className="bg-primary text-background py-4 px-9 rounded-sm"
          >
            Otkrij sve što se sprema
          </Link>
        </div>
      )}
    </div>
  );
};

export default Slider;
