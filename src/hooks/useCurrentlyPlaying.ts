import { usePlayer } from '@/lib/providers/use-player-state';
import { useSupabaseUser } from '@/lib/providers/user-state';
import { Song } from '@/types/supabase';
import { redirect } from 'next/navigation';

export const useCurrentlyPlaying = (songs: Song[]) => {
  // const { user } = useSupabaseUser();

  const { dispatch } = usePlayer();

  const onPlay = (id: string) => {
    // if (!user) redirect('/');

    const currentSong = songs.find((song) => song.id === id);

    if (!currentSong) {
      console.error(`Song with ID ${id} not found.`);
      return;
    }

    const genreSongs = songs.filter((song) => song.genre === currentSong.genre);

    dispatch({
      type: 'SET_ID',
      payload: id,
    });

    dispatch({
      type: 'SET_IDS',
      payload: genreSongs.map((song) => song.id),
    });
  };

  return onPlay;
};
