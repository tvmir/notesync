'use client';

import { useFetchSongByID } from '@/hooks/useFetchSong';
import { useLoadSongFile } from '@/hooks/useLoadSongFile';
import { usePlayer } from '@/lib/providers/use-player-state';
import { FC } from 'react';
import PlayerCard from './PlayerCard';

const Player: FC = ({}) => {
  const { state } = usePlayer();
  const { song } = useFetchSongByID(state.activeId!);
  const songFile = useLoadSongFile(song!);

  if (!song || !songFile || !state.activeId) return null;

  return (
    <div className="bottom-0 left-0 sticky p-4 bg-background w-full z-50 h-[350px]">
      <PlayerCard key={songFile} song={song} songFile={songFile} />
    </div>
  );
};

export default Player;
