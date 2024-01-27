import { Song } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const useLoadImage = (song: Song) => {
  const supabase = createClientComponentClient();

  if (!song) return null;

  const { data: coverImage } = supabase.storage
    .from('song_covers')
    .getPublicUrl(song.imageFile!);

  return coverImage.publicUrl;
};
