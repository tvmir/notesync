'use client';

import { Song } from '@/types/supabase';
import { FC } from 'react';
import PlaylistData from './PlaylistData';
import { useCurrentlyPlaying } from '@/hooks/useCurrentlyPlaying';
import RecommendedPlaylist from './RecommendedPlaylist';

interface PlaylistViewProps {
  songs: Song[];
  recommendedSongs: Song[];
}

const PlaylistView: FC<PlaylistViewProps> = ({ songs, recommendedSongs }) => {
  const onSongPlay = useCurrentlyPlaying({ songs });
  const onRecSongPlay = useCurrentlyPlaying({ recommendedSongs });

  const randomize = <T,>(songs: T[]) => {
    for (let i = songs.length - 1; i > 0; --i) {
      const j = Math.floor(Math.random() * (i + 1));
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    return songs;
  };

  const genrePlaylists: Record<string, Song[]> = Object.fromEntries(
    Object.entries(
      randomize(songs).reduce((acc: Record<string, Song[]>, song) => {
        const genre = song.genre!;
        acc[genre] = [...(acc[genre] || []), song];
        return acc;
      }, {})
    ).sort(([genreA], [genreB]) => {
      if (genreA === 'lo-fi') return -1;
      return genreB === 'lo-fi' ? 1 : 0;
    })
  );

  const recommendedPlaylist: Record<string, Song[]> = {
    recommended: randomize(recommendedSongs!),
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pl-[9px]">
      {recommendedSongs.length !== 0 &&
        Object.entries(recommendedPlaylist).map(([_, songs], i) => (
          <RecommendedPlaylist
            key={songs[i].id}
            onClick={(id) => onRecSongPlay(id)}
            data={songs[i]}
          />
        ))}
      {Object.entries(genrePlaylists).map(([_, songsInGenre]) => {
        return (
          <PlaylistData
            key={songsInGenre[0].id}
            onClick={(id) => onSongPlay(id)}
            data={songsInGenre[0]}
          />
        );
      })}
    </div>
  );
};

export default PlaylistView;
