import { FC } from 'react';
import Navbar from './_components/Navbar';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Home: FC = () => {
  return (
    <section>
      <Navbar />
      <div className="mx-auto md:w-4/5">
        <div className="text-center pt-4 md:mt-8 mx-auto w-[90%] md:w-4/5 ">
          <h1 className="font-bold leading-[50px] md:leading-[60px] lg:leading-[80px] inline tracking-[-1.4px] text-4xl md:text-5xl lg:text-6xl">
            The All-In-One Note-Taking{' '}
          </h1>
          <span className="text-gradient font-bold tracking-[-1.4px] text-4xl md:text-5xl lg:text-6xl">
            Tool For You
          </span>
          <p className="w-4/5 text-sm md:text-sm pt-2 mt-4 font-normal text-center tracking-loose mx-auto">
            Take your note-taking to the next level with integrated music to
            help you focus, powered by a recommendation system that suggests
            personalized playlists tailored to your preferences and productivity
            needs.
          </p>
          <div className="flex flex-row mx-auto justify-center pt-4 mt-4 ">
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-9 mx-auto rounded-2xl lg:w-4/5 mb-24 xl:mb-64">
        <Image
          alt="Dashboard"
          width={100}
          height={100}
          unoptimized
          src={'/landing-d1.png'}
          className="rounded-2xl mx-auto object-cover h-full w-full"
        />
      </div>
    </section>
  );
};

export default Home;
