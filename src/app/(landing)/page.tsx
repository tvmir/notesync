import { FC } from 'react';
import Navbar from './_components/Navbar';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Home: FC = () => {
  return (
    <section className="pb-8">
      <Navbar />
      <div className="mx-auto md:w-4/5">
        <div className="text-center md:mt-8 mx-auto w-[90%] md:w-4/5 pt-8">
          <h1 className="font-bold leading-[50px] md:leading-[60px] lg:leading-[80px] inline tracking-[-1.4px] text-4xl md:text-5xl lg:text-6xl">
            Where Music Meets{' '}
          </h1>
          <span className="text-gradient font-bold tracking-[-1.4px] text-4xl md:text-5xl lg:text-6xl">
            Productivity
          </span>
          <p className="w-[65%] text-sm md:text-sm pt-2 mt-4 font-normal text-center tracking-loose mx-auto">
            Elevate your productivity experience with built-in music and
            personalized recommendations to keep you focused.
          </p>
          <div className="flex flex-row mx-auto justify-center pt-4">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-8 mx-auto border rounded-xl w-[75%]">
        <Image
          alt="Dashboard"
          width={40}
          height={40}
          unoptimized
          src={'/landing-page.png'}
          className="rounded-xl mx-auto object-cover h-full w-full p-2"
        />
      </div>
    </section>
  );
};

export default Home;
