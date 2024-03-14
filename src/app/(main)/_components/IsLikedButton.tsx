'use client';

import { useToast } from '@/components/ui/use-toast';
import { usePlayer } from '@/lib/providers/use-player-state';
import { useSupabaseUser } from '@/lib/providers/user-state';
import { likeSong } from '@/lib/supabase/queries';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Heart } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';

interface IsLikedButtonProps {
  songId: string;
}

const IsLikedButton: FC<IsLikedButtonProps> = ({ songId }) => {
  const { state, dispatch } = usePlayer();
  const isLiked = state.likedSongs?.includes(songId);
  const router = useRouter();
  const { user } = useSupabaseUser();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!user?.id) return;

    // Getting the user's liked songs
    const fetchUserSongData = async () => {
      const { data, error } = await supabase
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.id)
        .eq('song_id', songId)
        .maybeSingle();

      if (!error && data) {
        dispatch({ type: 'LIKE_SONG', payload: songId });
      }
    };

    fetchUserSongData();
  }, [user?.id, songId, supabase]);

  // Function for liking/unliking a song
  const handleLikeTrigger = async () => {
    if (!user) redirect('/');

    if (isLiked) {
      const { error } = await supabase
        .from('liked_songs')
        .delete()
        .eq('user_id', user.id)
        .eq('song_id', songId);

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
