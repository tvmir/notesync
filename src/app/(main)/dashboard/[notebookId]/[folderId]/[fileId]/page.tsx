'use client';

import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('../../../../_components/Editor'), {
  ssr: false,
});

const FilePage = ({ params }: { params: { fileId: string } }) => {
  return (
    <div className="mt-40 max-w-[800px]">
      <Editor fileId={params.fileId} />
    </div>
  );
};

export default FilePage;
