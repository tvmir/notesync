import { FC } from 'react';
import Tasks from '../Tasks';
import MetricCards from './MetricCards';

interface MetricsProps {
  notebookId: string;
}

const Metrics: FC<MetricsProps> = ({ notebookId }) => {
  return (
    <div className="space-y-2 p-4 pt-0 max-w-5xl">
      <div className="grid gap-4 md:grid-cols-2">
        <MetricCards notebookId={notebookId} />
      </div>
      <div>
        <Tasks notebookId={notebookId} />
      </div>
    </div>
  );
};

export default Metrics;
