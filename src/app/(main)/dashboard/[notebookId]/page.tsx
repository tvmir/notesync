import { FC } from 'react';
import Metrics from '../../_components/Metrics';
import { fetchSongs } from '@/lib/supabase/queries';
import PlaylistView from '../../_components/PlaylistView';
import { useRecommendedSongs } from '@/hooks/useRecommendedSongs';

interface NotebookProps {
  params: { notebookId: string };
}

const NotebookPage: FC<NotebookProps> = async ({ params }) => {
  const { data: songs } = await fetchSongs();
  const recommendedSongs = await useRecommendedSongs();

  return (
    <div className="h-full pt-20">
      <Metrics notebookId={params?.notebookId} />
      <div className="overflow-y-scroll">
        <PlaylistView songs={songs!} recommendedSongs={recommendedSongs!} />
      </div>
    </div>
  );
};

export default NotebookPage;
