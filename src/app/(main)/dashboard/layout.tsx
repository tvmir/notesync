'use client';

import { useAppState } from '@/lib/providers/use-state';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FC, useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [timeSpentOnPage, setTimeSpentOnPage] = useState<number>(0);
  const supabase = createClientComponentClient();

  const { notebookId } = useAppState();

  // Updating the time the user has spent on the application
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeSpentOnPage((prevTime) => prevTime + 60);
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const updateTimeSpent = async () => {
      if (!notebookId) return;

      // Incrementing the time spent on the server
      const { error } = await supabase.rpc('increment_time_spent', {
        x: timeSpentOnPage,
        row_id: notebookId,
      });

      if (error) {
        console.error('Error updating time spent:', error);
      }
    };

    updateTimeSpent();
  }, [timeSpentOnPage]); // eslint-disable-line react-hooks/exhaustive-deps

  return <main className="flex h-screen">{children}</main>;
};

export default DashboardLayout;
