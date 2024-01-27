'use client';

import { useToast } from '@/components/ui/use-toast';
import { usePlayer } from '@/lib/providers/use-player-state';
import { useSupabaseUser } from '@/lib/providers/user-state';
import {
  fetchLikedSong,
  likeSong,
  removeLikedSong,
} from '@/lib/supabase/queries';
import { Heart } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

interface IsLikedButtonProps {
  songId: string;
}

const IsLikedButton: FC<IsLikedButtonProps> = ({ songId }) => {
  // const [isLiked, setIsLiked] = useState<boolean>(false);
  const { state, dispatch } = usePlayer();
  const isLiked = state.likedSongs?.includes(songId);
  const router = useRouter();
  const { user } = useSupabaseUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserSongData = async () => {
      const { data, error } = await fetchLikedSong(user.id, songId);

      console.log('LIKED SONGS: ' + data);

      // if (!error && data) setIsLiked(true);
      if (!error && data) {
        dispatch({ type: 'LIKE_SONG', payload: songId });
      }
    };

    fetchUserSongData();
  }, [user?.id, songId]);

  // const handleLikeTrigger = async () => {
  //   if (!user) redirect('/');

  //   if (isLiked) {
  //     const { error } = await removeLikedSong(user.id, songId);

  //     if (error) {
  //       toast({
  //         variant: 'destructive',
  //         description:
  //           'Something went wrong when trying to remove the like from this song, please try again.',
  //       });
  //     } else {
  //       setIsLiked(false);
  //     }
  //   } else {
  //     const { error } = await likeSong(user.id, songId);

  //     if (error) {
  //       toast({
  //         variant: 'destructive',
  //         description:
  //           'Something went wrong when trying to like this song, please try again.',
  //       });
  //     } else {
  //       setIsLiked(true);
  //     }
  //   }

  //   router.refresh();
  // };

  const handleLikeTrigger = async () => {
    if (!user) redirect('/');

    if (isLiked) {
      const { error } = await removeLikedSong(user.id, songId);

      if (error) {
        toast({
          variant: 'destructive',
          description:
            'Something went wrong when trying to remove the like from this song, please try again.',
        });
      } else {
        dispatch({ type: 'REMOVE_LIKE_SONG', payload: songId });
      }
    } else {
      const { error } = await likeSong(user.id, songId);

      if (error) {
        toast({
          variant: 'destructive',
          description:
            'Something went wrong when trying to like this song, please try again.',
        });
      } else {
        dispatch({ type: 'LIKE_SONG', payload: songId });
      }
    }

    router.refresh();
  };

  return (
    <button className="hover:opacity-75 transition" onClick={handleLikeTrigger}>
      <Heart fill={isLiked ? 'white' : ''} color="white" size={20} />
    </button>
  );
};

export default IsLikedButton;
