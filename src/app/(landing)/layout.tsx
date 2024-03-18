import { FC } from 'react';

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: FC<HomeLayoutProps> = ({ children }) => {
  return <main className="overflow-y-auto hide-scrollbar">{children}</main>;
};

export default HomeLayout;
