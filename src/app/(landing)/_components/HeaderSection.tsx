import React, { FC } from 'react';

interface HeaderSectionProps {
  title: string;
  subheading?: string;
}

const HeaderSection: FC<HeaderSectionProps> = ({ title, subheading }) => {
  return (
    <>
      <section className="flex flex-col gap-4 justify-center items-start md:items-center">
        {subheading ? (
          <>
            <h2 className="text-left text-3xl sm:text-5xl sm:max-w-[750px] md:text-center font-semibold">
              {title}
            </h2>
            <p className="sm:max-w-[450px] md:text-center">{subheading}</p>
          </>
        ) : (
          <></>
        )}
      </section>
    </>
  );
};

export default HeaderSection;
