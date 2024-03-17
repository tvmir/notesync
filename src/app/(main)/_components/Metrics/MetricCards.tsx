'use client';

import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppState } from '@/lib/providers/use-state';

interface MetricCardsProps {
  notebookId: string;
}

const MetricCards: FC<MetricCardsProps> = ({ notebookId }) => {
  const { state } = useAppState();

  const currentNotebook = state.notebooks.find(
    (notebook) => notebook.id === notebookId
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium">POMODORO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold">
            {currentNotebook?.pomodoroCount == 1
              ? '1 SESSION'
              : `${currentNotebook?.pomodoroCount} SESSIONS`}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            +{((currentNotebook?.pomodoroCount! / 100) * 100).toFixed(2)}% from
            last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium">FOCUS TIME</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold">
            {Math.floor(currentNotebook?.timeSpent! / 60) == 1
              ? '1 MINUTE'
              : `${Math.floor(currentNotebook?.timeSpent! / 60)} MINUTES`}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            +
            {(
              (Math.floor(currentNotebook?.timeSpent! / 60) / 60) *
              100
            ).toFixed(2)}
            % from last week
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default MetricCards;
