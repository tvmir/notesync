'use client';

import { Song } from '@/types/supabase';
import { FC, useEffect, useState } from 'react';
import PlaylistSongItem from '../Playlists/PlaylistSongItem';
import IsLikedButton from './IsLikedButton';
import {
  PauseCircle,
  PlayCircle,
  StepBack,
  StepForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import CustomSlider from './CustomSlider';
import { usePlayer } from '@/lib/providers/use-player-state';
// @ts-ignore
import useSound from 'use-sound';

interface PlayerCardProps {
  song: Song;
  songFile: string;
}

const PlayerCard: FC<PlayerCardProps> = ({ song, songFile }) => {
  const { state, dispatch } = usePlayer();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const PlayIcon = isPlaying ? PauseCircle : PlayCircle;
  const VolumeSliderIcon = state.volume === 0 ? VolumeX : Volume2;

  // Checks the song ID of the previous song in the list, if it's the first song in the playlist nothing happens
  const playPreviousSong = () => {
    if (state.ids.length === 0) return;

    const currentSong = state.ids.findIndex((sId) => sId === state.activeId);

    const prev = state.ids[currentSong - 1];

    if (!prev) {
      dispatch({
        type: 'SET_ID',
        payload: state.ids[state.ids.length - 1],
      });
    }

    dispatch({
      type: 'SET_ID',
      payload: prev,
    });
  };

  // Responsible for the player functionality
  const [play, { pause, sound }] = useSound(songFile, {
    volume: state.volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      playNextSong();
    },
    onpause: () => setIsPlaying(false),
    format: ['mp3'],
  });

  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    };
  }, [sound]);

  // Plays/pauses the current song
  const playSong = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  // Checks the song ID of the next song in the list and plays it accordingly
  const playNextSong = () => {
    if (state.ids.length === 0) return;

    const currentSong = state.ids.findIndex((sId) => sId === state.activeId);

    const next = state.ids[currentSong + 1];

    if (!next) {
      dispatch({
        type: 'SET_ID',
        payload: state.ids[0],
      });
    }

    dispatch({
      type: 'SET_ID',
      payload: next,
    });
  };

  // Volume handlers
  const toggleVolumeMute = () => {
    dispatch({ type: 'SET_VOLUME', payload: state.volume === 0 ? 1 : 0 });
  };

  const handleVolumeChange = (value: number) => {
    dispatch({ type: 'SET_VOLUME', payload: value });
  };

  return (
    <div>
      <div className="flex w-full justify-center">
        <div className="flex items-center gap-x-4">
          <PlaylistSongItem data={song} />
        </div>
      </div>
      <div className="h-full flex justify-center items-center w-full gap-x-4">
        <StepBack
          size={18}
          className="text-muted-foreground cursor-pointer hover:text-white transition"
          onClick={playPreviousSong}
        />
        <div
          className="flex items-center justify-center h-10 w-10 rounded-full bg-background p-1 cursor-pointer"
          onClick={playSong}
        >
          <PlayIcon size={28} className="text-white cursor-pointer" />
        </div>
        <StepForward
          size={18}
          className="text-muted-foreground cursor-pointer hover:text-white transition"
          onClick={playNextSong}
        />
      </div>
      <div className="flex justify-between pt-1">
        <div className="flex items-center gap-x-2 w-[89px]">
          <VolumeSliderIcon
            className="cursor-pointer"
            onClick={toggleVolumeMute}
            size={20}
          />
          <CustomSlider value={state.volume} onChange={handleVolumeChange} />
        </div>
        <IsLikedButton songId={song.id} />
      </div>
    </div>
  );
};

export default PlayerCard;
