import { Song } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Get the song mp3 files from Supabase Storage
export const useLoadSongFile = (song: Song) => {
  const supabase = createClientComponentClient();

  if (!song) return null;

  const { data: songUrl } = supabase.storage
    .from('songs')
    .getPublicUrl(song.songFile!);

  return songUrl.publicUrl;
};
