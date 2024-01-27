import { FC } from 'react';
import Metrics from '../../_components/Metrics';
import { fetchSongs, fetchSongsByGenre } from '@/lib/supabase/queries';
import PlaylistView from '../../_components/PlaylistView';

interface NotebookProps {
  params?: { notebookId: string };
}

const NotebookPage: FC<NotebookProps> = async ({}) => {
  const { data: songs } = await fetchSongs();

  return (
    <div className="p-4">
      <Metrics />
      <div>
        <PlaylistView songs={songs!} />
      </div>
    </div>
  );
};

export default NotebookPage;
