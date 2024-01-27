import { FC } from 'react';
import HeaderSection from './_components/HeaderSection';
import Login from '../(auth)/login/page';
import Navbar from './_components/Navbar';

interface HomeProps {}

const Home: FC<HomeProps> = ({}) => {
  return (
    <section>
      <Navbar />
      <div className="overflow-hidden px-4 sm:px-6 mt-10 sm:flex sm:flex-col gap-4 md:justify-center md:items-center">
        <HeaderSection
          title="notesync"
          subheading="Elevating Note-taking for your needs"
        />
      </div>
    </section>
  );
};

export default Home;
