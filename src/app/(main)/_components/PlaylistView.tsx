'use client';

import { Song } from '@/types/supabase';
import { FC } from 'react';
import PlaylistItem from './PlaylistItem';
import { useCurrentlyPlaying } from '@/hooks/useCurrentlyPlaying';

interface PlaylistViewProps {
  songs: Song[];
}

const PlaylistView: FC<PlaylistViewProps> = ({ songs }) => {
  const onSongPlay = useCurrentlyPlaying(songs);

  const groupedSongsByGenre: Record<string, Song[]> = songs.reduce(
    (acc: Record<string, Song[]>, song) => {
      const genre = song.genre!;
      acc[genre] = [...(acc[genre] || []), song];
      return acc;
    },
    {}
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
      {Object.entries(groupedSongsByGenre).map(([genre, songsInGenre]) => (
        <PlaylistItem
          key={genre}
          onClick={(id) => onSongPlay(id)}
          data={songsInGenre[0]}
        />
      ))}
    </div>
  );
};

export default PlaylistView;
