'use client';

import { Notebook } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { FC } from 'react';

interface SelectNotebookProps {
  notebook: Notebook;
  onClick?: (notebook: Notebook) => void;
}

const SelectNotebook: FC<SelectNotebookProps> = ({ notebook, onClick }) => {
  const supabase = createClientComponentClient();

  return (
    <Link
      href={`/dashboard/${notebook.id}`}
      onClick={() => {
        if (onClick) onClick(notebook);
      }}
      className="flex 
      rounded-md 
      hover:bg-muted 
      transition-all 
      flex-row 
      p-2 
      gap-4 
      justify-center 
      cursor-pointer 
      items-center 
      my-2"
    >
      <div className="flex flex-col">
        <p
          className="text-lg 
        w-[170px] 
        overflow-hidden 
        overflow-ellipsis 
        whitespace-nowrap"
        >
          {notebook.title}
        </p>
      </div>
    </Link>
  );
};

export default SelectNotebook;
