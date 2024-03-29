'use client';

import { Song } from '@/types/supabase';
import Image from 'next/image';
import { FC } from 'react';
import PlayButton from '../Player/PlayButton';

interface PlaylistDataProps {
  data: Song;
  onClick: (id: string) => void;
}

const PlaylistData: FC<PlaylistDataProps> = ({ data, onClick }) => {
  return (
    <div
      className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-2 border-none cursor-pointer transition p-2"
      onClick={() => onClick(data.id)}
    >
      <div className="relative h-[160px] w-[130px] md:h-[240px] md:w-[200px] rounded-md overflow-hidden">
        <Image
          src={
            data.genre === 'lo-fi'
              ? '/lofi-cover.webp'
              : data.genre === 'classical'
              ? '/vinyl-art-cover.jpeg'
              : '/binaural-cover.jpeg'
          }
          fill
          alt="Cover Image"
          unoptimized={true}
          className="object-cover transition-all hover:scale-105"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-2 gap-y-1">
        <p className="truncate w-full">
          {data.genre === 'lo-fi'
            ? 'Chill Lo-Fi'
            : data.genre === 'classical'
            ? 'Classical Era'
            : 'Binaural Tunes'}
        </p>
      </div>
      <div className="absolute bottom-16 right-5">
        <PlayButton />
      </div>
    </div>
  );
};

export default PlaylistData;
