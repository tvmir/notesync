'use client';

import { Song } from '@/types/supabase';
import { FC, useEffect, useState } from 'react';
import PlaylistSongItem from './PlaylistSongItem';
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
  const [volume, setVolume] = useState<number>(1);

  const PlayIcon = isPlaying ? PauseCircle : PlayCircle;
  const VolumeSliderIcon = volume === 0 ? VolumeX : Volume2;

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

  const [play, { pause, sound }] = useSound(songFile, {
    volume: volume,
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

  const playSong = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

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

  const toggleVolumeMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
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
      <div className="flex justify-end">
        <IsLikedButton songId={song.id} />
      </div>
      {/* <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeSliderIcon
            className="cursor-pointer"
            onClick={toggleVolumeMute}
            size={30}
          />
          <CustomSlider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div> */}
    </div>
  );
};

export default PlayerCard;
