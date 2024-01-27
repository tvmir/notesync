import { FC } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return <main className="flex overflow-hidden h-screen">{children}</main>;
};

export default DashboardLayout;
