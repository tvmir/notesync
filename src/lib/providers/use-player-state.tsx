'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
  useEffect,
} from 'react';

interface PlayerState {
  ids: string[];
  activeId?: string;
  likedSongs?: string[];
}

type PlayerAction =
  | { type: 'SET_ID'; payload: string }
  | { type: 'SET_IDS'; payload: string[] }
  | { type: 'RESET' }
  | { type: 'LIKE_SONG'; payload: string }
  | { type: 'REMOVE_LIKE_SONG'; payload: string };

interface PlayerContextProps {
  state: PlayerState;
  dispatch: Dispatch<PlayerAction>;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

const playerReducer = (
  state: PlayerState,
  action: PlayerAction
): PlayerState => {
  switch (action.type) {
    case 'SET_ID':
      return { ...state, activeId: action.payload };
    case 'SET_IDS':
      return { ...state, ids: action.payload };
    case 'RESET':
      return { ids: [], activeId: undefined };
    case 'LIKE_SONG':
      return {
        ...state,
        likedSongs: [...state.likedSongs!, action.payload],
      };
    case 'REMOVE_LIKE_SONG':
      return {
        ...state,
        likedSongs: state.likedSongs!.filter((id) => id !== action.payload),
      };
    default:
      return state;
  }
};

const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, {
    ids: [],
    activeId: undefined,
    likedSongs: [],
  });

  useEffect(() => {
    console.log('Song State Changed', state);
  }, [state]);

  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
};

const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }

  return context;
};

export { PlayerProvider, usePlayer };
