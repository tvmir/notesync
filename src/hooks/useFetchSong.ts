import { useEffect, useMemo, useState } from 'react';
import { Song } from '@/types/supabase';
import { fetchSongByGenreID, fetchSongByID } from '@/lib/supabase/queries';
import { useToast } from '@/components/ui/use-toast';

export const useFetchSongByID = (id: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [song, setSong] = useState<Song | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);

    const fetchCurrentSong = async () => {
      const { data, error } = await fetchSongByID(id);

      if (error) {
        setIsLoading(false);
        toast({
          variant: 'destructive',
          description: 'Unable to get the chosen song, please try again',
        });
      }

      setSong(data as Song);
      setIsLoading(false);
    };

    fetchCurrentSong();
  }, [id, song?.id, toast]);

  return useMemo(
    () => ({
      isLoading,
      song,
    }),
    [isLoading, song]
  );
};
