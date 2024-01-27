import { FC } from 'react';
import Sidebar from '../../_components/Sidebar';

interface NotebookProps {
  children: React.ReactNode;
  params: any;
}

const NotebookLayout: FC<NotebookProps> = ({ children, params }) => {
  return (
    <main className="flex overflow-hidden h-screen w-screen">
      <Sidebar params={params} />

      {/* Mobile */}
      <div className="border-secondary border-l-[1px] w-full relative overflow-scroll">
        {children}
      </div>
    </main>
  );
};

export default NotebookLayout;
