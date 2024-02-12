import supabaseServer from '@/lib/supabase/supabaseServer';
import { Song } from '@/types/supabase';

export const useRecommendedSongs = async (): Promise<Song[]> => {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('recommended_songs')
    .select('*, songs(*)')
    .eq('user_id', user?.id);

  if (error) {
    console.log('Error: Unable to fetch recommended songs');
    return [];
  }

  if (!data) return [];

  return data.map((item) => ({
    ...item.songs,
  }));
};
