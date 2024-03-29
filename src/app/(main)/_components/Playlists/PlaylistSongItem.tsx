'use client';

import { useLoadImage } from '@/hooks/useLoadImage';
import { usePlayer } from '@/lib/providers/use-player-state';
import { Song } from '@/types/supabase';
import Image from 'next/image';
import { FC } from 'react';

interface PlaylistSongItemProps {
  data: Song;
  onClick?: (id: string) => void;
}

const PlaylistSongItem: FC<PlaylistSongItemProps> = ({ data, onClick }) => {
  const { dispatch } = usePlayer();
  const imageUrl = useLoadImage(data);

  // Plays the songs in the playlist once it's been clicked
  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }

    return dispatch({
      type: 'SET_ID',
      payload: data.id,
    });
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center gap-y-3 cursor-pointer w-full p-2 rounded-md"
    >
      <div className="relative rounded-md min-h-[180px] min-w-[180px] overflow-hidden">
        <Image
          fill
          src={imageUrl || '/no-song-img.jpeg'}
          alt="Song Cover"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-2 overflow-hidden items-center">
        <p className="text-white text-sm truncate max-w-40">{data.trackName}</p>
        <p className="text-muted-foreground text-xs truncate">{data.artist}</p>
      </div>
    </div>
  );
};

export default PlaylistSongItem;
