'use client';

import Image from 'next/image';
import { FC } from 'react';
import PlayButton from './PlayButton';
import { Song } from '@/types/supabase';

interface RecommendedPlaylistProps {
  data: Song;
  onClick: (id: string) => void;
}

const RecommendedPlaylist: FC<RecommendedPlaylistProps> = ({
  data,
  onClick,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-2 border-none cursor-pointer transition p-2"
      onClick={() => onClick(data.id)}
    >
      <div className="relative h-[240px] w-[200px] rounded-md overflow-hidden">
        <Image
          src={'/foryou-cover.jpeg'}
          fill
          alt="For You Cover Image"
          className="object-cover transition-all hover:scale-105"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-2 gap-y-1">
        <p className="truncate w-full">For You</p>
      </div>
      <div className="absolute bottom-16 right-5">
        <PlayButton />
      </div>
    </div>
  );
};

export default RecommendedPlaylist;
