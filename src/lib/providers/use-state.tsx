'use client';

import React, {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { usePathname } from 'next/navigation';
import { File, Folder, Notebook } from '@/types/supabase';
import { fetchFiles } from '../supabase/queries';

export type appFoldersType = Folder & { files: File[] | [] };
export type NotebookFolderType = Notebook & {
  folders: appFoldersType[] | [];
};

interface AppState {
  notebooks: NotebookFolderType[] | [];
}

type Action =
  | {
      type: 'SET_NOTEBOOK';
      payload: { notebooks: NotebookFolderType[] | [] };
    }
  | { type: 'ADD_NOTEBOOK'; payload: NotebookFolderType }
  | {
      type: 'UPDATE_NOTEBOOK';
      payload: { notebook: Partial<NotebookFolderType>; notebookId: string };
    }
  | {
      type: 'SET_FOLDERS';
      payload: { notebookId: string; folders: [] | appFoldersType[] };
    }
  | {
      type: 'ADD_FOLDER';
      payload: { notebookId: string; folder: appFoldersType };
    }
  | {
      type: 'DELETE_FOLDER';
      payload: { notebookId: string; folderId: string };
    }
  | {
      type: 'UPDATE_FOLDER';
      payload: {
        folder: Partial<appFoldersType>;
        notebookId: string;
        folderId: string;
      };
    }
  | {
      type: 'SET_FILES';
      payload: { notebookId: string; files: File[]; folderId: string };
    }
  | {
      type: 'ADD_FILE';
      payload: { notebookId: string; file: File; folderId: string };
    }
  | {
      type: 'UPDATE_FILE';
      payload: {
        file: Partial<File>;
        folderId: string;
        notebookId: string;
        fileId: string;
      };
    }
  | {
      type: 'DELETE_FILE';
      payload: { notebookId: string; folderId: string; fileId: string };
    };

const initialState: AppState = { notebooks: [] };

const appReducer = (
  state: AppState = initialState,
  action: Action
): AppState => {
  switch (action.type) {
    case 'ADD_NOTEBOOK':
      return {
        ...state,
        notebooks: [...state.notebooks, action.payload],
      };
    case 'UPDATE_NOTEBOOK':
      return {
        ...state,
        notebooks: state.notebooks.map((notebook) => {
          if (notebook.id === action.payload.notebookId) {
            return {
              ...notebook,
              ...action.payload.notebook,
            };
          }
          return notebook;
        }),
      };
    case 'SET_NOTEBOOK':
      return {
        ...state,
        notebooks: action.payload.notebooks,
      };
    case 'SET_FOLDERS':
      return {
        ...state,
        notebooks: state.notebooks.map((notebook) => {
          if (notebook.id === action.payload.notebookId) {
            return {
              ...notebook,
              folders: action.payload.folders.sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              ),
            };
          }
          return notebook;
        }),
      };
    case 'ADD_FOLDER':
      return {
        ...state,
        notebooks: state.notebooks.map((notebook) => {
          return {
            ...notebook,
            folders: [...notebook.folders, action.payload.folder].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            ),
          };
        }),
      };
    case 'UPDATE_FOLDER':
      return {
        ...state,
        notebooks: state.notebooks.map((notebook) => {
          if (notebook.id === action.payload.notebookId) {
            return {
              ...notebook,
              folders: notebook.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return { ...folder, ...action.payload.folder };
                }
                return folder;
              }),
            };
          }
          return notebook;
        }),
      };
    case 'DELETE_FOLDER':
      return {
        ...state,
        notebooks: state.notebooks.map((notebook) => {
          if (notebook.id === action.payload.notebookId) {
            return {
              ...notebook,
              folders: notebook.folders.filter(
                (folder) => folder.id !== action.payload.folderId
              ),
            };
          }
          return notebook;
        }),
      };
    case 'SET_FILES':
      return {
        ...state,
        notebooks: state.notebooks.map((notebook) => {
          if (notebook.id === action.payload.notebookId) {
            return {
              ...notebook,
              folders: notebook.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: action.payload.files,
                  };
                }
                return folder;
              }),
            };
          }
          return notebook;
        }),
      };
    case 'ADD_FILE':
      return {
        ...state,
        notebooks: state.notebooks.map((notebook) => {
          if (notebook.id === action.payload.notebookId) {
            return {
              ...notebook,
              folders: notebook.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: [...folder.files, action.payload.file].sort(
                      (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    ),
                  };
                }
                return folder;
              }),
            };
          }
          return notebook;
        }),
      };
    case 'DELETE_FILE':
      return {
        ...state,
        notebooks: state.notebooks.map((notebook) => {
          if (notebook.id === action.payload.notebookId) {
            return {
              ...notebook,
              folder: notebook.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: folder.files.filter(
                      (file) => file.id !== action.payload.fileId
                    ),
                  };
                }
                return folder;
              }),
            };
          }
          return notebook;
        }),
      };
    case 'UPDATE_FILE':
      return {
        ...state,
        notebooks: state.notebooks.map((notebook) => {
          if (notebook.id === action.payload.notebookId) {
            return {
              ...notebook,
              folders: notebook.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: folder.files.map((file) => {
                      if (file.id === action.payload.fileId) {
                        return {
                          ...file,
                          ...action.payload.file,
                        };
                      }
                      return file;
                    }),
                  };
                }
                return folder;
              }),
            };
          }
          return notebook;
        }),
      };
    default:
      return initialState;
  }
};

const AppStateContext = createContext<
  | {
      state: AppState;
      dispatch: Dispatch<Action>;
      notebookId: string | undefined;
      folderId: string | undefined;
      fileId: string | undefined;
    }
  | undefined
>(undefined);

interface AppStateProviderProps {
  children: React.ReactNode;
}

const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const pathname = usePathname();

  const notebookId = useMemo(() => {
    const urlSegments = pathname?.split('/').filter(Boolean);
    if (urlSegments)
      if (urlSegments.length > 1) {
        return urlSegments[1];
      }
  }, [pathname]);

  const folderId = useMemo(() => {
    const urlSegments = pathname?.split('/').filter(Boolean);
    if (urlSegments)
      if (urlSegments?.length > 2) {
        return urlSegments[2];
      }
  }, [pathname]);

  const fileId = useMemo(() => {
    const urlSegments = pathname?.split('/').filter(Boolean);
    if (urlSegments)
      if (urlSegments?.length > 3) {
        return urlSegments[3];
      }
  }, [pathname]);

  useEffect(() => {
    if (!folderId || !notebookId) return;

    const getFilesFromFolder = async () => {
      const { data, error } = await fetchFiles(folderId);

      if (error) {
        console.log(error);
      }

      if (!data) return;

      dispatch({
        type: 'SET_FILES',
        payload: { notebookId, files: data, folderId },
      });
    };

    getFilesFromFolder();
  }, [folderId, notebookId]);

  // useEffect(() => {
  //   console.log('App State Changed', state);
  // }, [state]);

  return (
    <AppStateContext.Provider
      value={{ state, dispatch, notebookId, folderId, fileId }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;

export const useAppState = () => {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }

  return context;
};
