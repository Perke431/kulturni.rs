import { ReactNode } from 'react';

const Section = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return <section className={className}>{children}</section>;
};

export default Section;
