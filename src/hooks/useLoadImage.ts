import { Song } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Get the song covers from Supabase Storage
export const useLoadImage = (song: Song) => {
  const supabase = createClientComponentClient();

  if (!song) return null;

  if (!song.imageFile) return;

  const { data: coverImage } = supabase.storage
    .from('song_covers')
    .getPublicUrl(song.imageFile!);

  return coverImage.publicUrl;
};
