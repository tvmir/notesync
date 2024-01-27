'use client';

import { Song } from '@/types/supabase';
import Image from 'next/image';
import { FC } from 'react';
import PlayButton from './PlayButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PlaylistItemProps {
  data: Song;
  onClick: (id: string) => void;
}

const PlaylistItem: FC<PlaylistItemProps> = ({ data, onClick }) => {
  return (
    <div
      className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-2 border-none cursor-pointer transition p-3"
      onClick={() => onClick(data.id)}
    >
      <div className="relative h-[240px] w-[200px] rounded-md overflow-hidden">
        <Image
          src={
            data.genre === 'lo-fi'
              ? '/lofi-cover.webp'
              : '/classical-cover.jpeg'
          }
          fill
          alt="Cover Image"
          className="object-cover transition-all hover:scale-105"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-medium truncate w-full">
          {data.genre === 'lo-fi' ? 'Chill Lo-Fi' : 'Classical'}
        </p>
        {/* <p className="text-primary text-sm pb-4 w-full truncate">
          {data.artist}
        </p> */}
      </div>
      <div className="absolute bottom-24 right-5">
        <PlayButton />
      </div>
      {/* <Button>
        <Link href={`/dashboard/d5ab32dd-29f2-4381-a08c-7c3c482c5386/playlist`}>
          Lo-fi playlist
        </Link>
      </Button> */}
    </div>
  );
};

export default PlaylistItem;
