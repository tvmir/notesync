'use client';

import { useAppState } from '@/lib/providers/state';
import { Notebook } from '@/types/supabase';
import { FC, useEffect, useState } from 'react';
import SelectNotebook from './SelectNotebook';
import NewNotebook from './NewNotebook';
import CreationDialog from './CreationDialog';

interface NotebooksListProps {
  userNotebooks: Notebook[] | [];
  defaultNotebook: Notebook | undefined;
}

const NotebooksList: FC<NotebooksListProps> = ({
  userNotebooks,
  defaultNotebook,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { state, dispatch } = useAppState();
  const [selectedOption, setSelectedOption] = useState<Notebook>(
    defaultNotebook!
  );

  useEffect(() => {
    if (!state.notebooks.length) {
      dispatch({
        type: 'SET_NOTEBOOK',
        payload: {
          notebooks: [...userNotebooks].map((notebook) => ({
            ...notebook,
            folders: [],
          })),
        },
      });
    }
  }, [userNotebooks]);

  const handleNotebook = (notebook: Notebook) => {
    setSelectedOption(notebook);
    setIsOpen(false);
  };

  useEffect(() => {
    const getDefaultNotebook = state.notebooks.find(
      (notebook) => notebook.id === defaultNotebook?.id
    );
    if (getDefaultNotebook) setSelectedOption(getDefaultNotebook);
  }, [state, defaultNotebook]);

  return (
    <div className="relative inline-block text-left">
      <div>
        <span onClick={() => setIsOpen(!isOpen)}>
          {selectedOption ? (
            <SelectNotebook notebook={selectedOption} />
          ) : (
            'Select a notebook'
          )}
        </span>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute w-full rounded-md shadow-md z-50 h-[190px] bg-black/10 backdrop-blur-lg group overflow-scroll border-[1px] border-muted">
          <div className="rounded-md flex flex-col">
            <div className="!p-2">
              {!!userNotebooks.length && (
                <>
                  <hr></hr>
                  {userNotebooks.map((notebook) => (
                    <SelectNotebook
                      key={notebook.id}
                      notebook={notebook}
                      onClick={() => handleNotebook(notebook)}
                    />
                  ))}
                </>
              )}
            </div>
            {/* <CreationDialog
              header="Create A Notebook"
              content={<NewNotebook />}
              description="Take organization to the next level."
            >
              <div className="flex transition-all hover:bg-muted justify-center items-center gap-2 p-2 w-full">
                <article className="flex items-center justify-center text-slate-500 rounded-full bg-slate-800 w-4 h-4">
                  +
                </article>
                Create notebook
              </div>
            </CreationDialog> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotebooksList;
