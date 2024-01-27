import { Song } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const useLoadSongFile = (song: Song) => {
  const supabase = createClientComponentClient();

  if (!song) return null;

  const { data: songUrl } = supabase.storage
    .from('songs')
    .getPublicUrl(song.songFile!);

  return songUrl.publicUrl;
};
