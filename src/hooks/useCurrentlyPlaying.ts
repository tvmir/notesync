import { usePlayer } from '@/lib/providers/use-player-state';
import { Song } from '@/types/supabase';
import { redirect } from 'next/navigation';

interface Playing {
  songs?: Song[];
  recommendedSongs?: Song[];
}

export const useCurrentlyPlaying = ({ songs, recommendedSongs }: Playing) => {
  const { dispatch } = usePlayer();

  const onPlay = (id: string) => {
    const currentSong = songs?.find((song) => song.id === id);

    const genreSongs = songs?.filter(
      (song) => song.genre === currentSong?.genre
    );

    dispatch({
      type: 'SET_ID',
      payload: id,
    });

    if (songs) {
      dispatch({
        type: 'SET_IDS',
        payload: genreSongs?.map((song) => song.id)!,
      });
    } else {
      dispatch({
        type: 'SET_IDS',
        payload: recommendedSongs?.map((song) => song.id)!,
      });
    }
  };

  return onPlay;
};
