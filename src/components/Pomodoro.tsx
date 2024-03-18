'use client';

import React, { useState, useEffect, FC, useMemo, useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Play, Pause } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { incrementPomodoroCounter } from '@/hooks/usePomodoro';
import { useAppState } from '@/lib/providers/use-state';

interface PomodoroProps {
  notebookId: string;
}

type Timer = {
  id: number;
  label: string;
};

const PomodoroTimer: FC<PomodoroProps> = ({ notebookId }) => {
  const { toast } = useToast();
  const { state, dispatch } = useAppState();

  const [pCount, setPCount] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(20);
  const [seconds, setSeconds] = useState<number>(0);
  const [isCount, setIsCount] = useState<boolean>(false);
  const [isWorking, setIsWorking] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [hasTimerStarted, setHasTimerStarted] = useState<boolean>(false);
  const [defaultDuration, setDefaultDuration] = useState<Timer>({
    id: 20,
    label: '20 minutes',
  });
  const [defaultBreak, setDefaultBreak] = useState({
    id: 5,
    label: '5 minutes',
  });

  const calculatePomodoroCount = useCallback(() => {
    if (!notebookId) return;

    const notebook = state.notebooks.find(
      (notebook) => notebook.id === notebookId
    );

    if (!notebook) return;

    return notebook.pomodoroCount;
  }, [notebookId, state]);

  useEffect(() => {
    const currentPomodoroCount = calculatePomodoroCount();

    if (currentPomodoroCount !== undefined) setPCount(currentPomodoroCount!);
  }, [calculatePomodoroCount]);

  // Duration times
  const durations = [
    { id: 15, label: '15 minutes' },
    { id: 20, label: '20 minutes' },
    { id: 25, label: '25 minutes' },
    { id: 30, label: '30 minutes' },
    { id: 45, label: '45 minutes' },
    { id: 60, label: '60 minutes' },
  ];

  // Break times
  const breaks: Timer[] = useMemo(
    () => [
      { id: 5, label: '5 minutes' },
      { id: 10, label: '10 minutes' },
      { id: 15, label: '15 minutes' },
      { id: 30, label: '30 minutes' },
    ],
    []
  );

  useEffect(() => {
    if (hasTimerStarted) {
      let timer: NodeJS.Timeout;

      // Timer functionality
      const tick = () => {
        if (!isPaused) {
          if (seconds === 0) {
            if (minutes === 0) {
              setIsWorking(!isWorking);
              setIsPaused((prev) => !prev);
              setMinutes(isWorking ? defaultBreak.id : defaultDuration.id);
              setSeconds(0);
              if (isWorking) setIsCount(true);
            } else {
              setMinutes((prev) => prev - 1);
              setSeconds(59);
            }
          } else {
            setSeconds((prev) => prev - 1);
          }
        }
      };

      timer = setInterval(tick, 1000);

      return () => clearInterval(timer);
    }
  }, [
    isWorking,
    isPaused,
    minutes,
    seconds,
    hasTimerStarted,
    defaultDuration,
    defaultBreak,
  ]);

  // Updating the number of completed pomodoro sessions on the server and state
  useEffect(() => {
    const updateCount = async () => {
      if (!notebookId) return;

      if (isCount) {
        dispatch({
          type: 'UPDATE_NOTEBOOK',
          payload: {
            notebook: { pomodoroCount: pCount + 1 },
            notebookId,
          },
        });

        const { error } = await incrementPomodoroCounter({
          x: 1,
          row_id: notebookId,
        });

        if (error) {
          toast({
            variant: 'destructive',
            description: 'Something went wrong with the pomodoro counter.',
          });
        }
      }

      setIsCount(false);
    };

    updateCount();
  }, [isCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlayPause = () => {
    setIsPaused((prev) => !prev);
    setHasTimerStarted(true);
  };

  const handleDurationChange = (duration: Timer) => {
    if (!isWorking) {
      setDefaultDuration(duration);
    } else {
      setMinutes(duration.id);
      setSeconds(0);
      setDefaultDuration(duration);
    }
  };

  const handleBreakChange = (breakTime: Timer) => {
    if (isWorking) {
      setDefaultBreak(breakTime);
    } else {
      setMinutes(breakTime.id);
      setSeconds(0);
      setDefaultBreak(breakTime);
    }
  };

  const formatTime = (time: number) => (time < 10 ? `0${time}` : `${time}`);

  const Icon = isPaused ? Play : Pause;

  return (
    <>
      <div className="flex items-center gap-2 mr-auto pl-16 md:pl-0">
        <div className="flex space-x-4 border rounded-md p-2 max-w-32 overflow-hidden">
          <p className="min-w-11">
            {formatTime(minutes)}:{formatTime(seconds)}
          </p>
          <div className="flex justify-between space-x-1">
            <button onClick={togglePlayPause}>
              <Icon size={14} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <MoreHorizontal size={11} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <span>Duration</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {durations.map((d) => (
                          <DropdownMenuItem
                            key={d.id}
                            onClick={() => handleDurationChange(d)}
                          >
                            <span>{d.label}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <span>Break</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {breaks.map((b) => (
                          <DropdownMenuItem
                            key={b.id}
                            onClick={() => handleBreakChange(b)}
                          >
                            <span>{b.label}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
};

export default PomodoroTimer;
