import { PlayCircle } from 'lucide-react';
import { FC } from 'react';

interface PlayButtonProps {}

const PlayButton: FC<PlayButtonProps> = ({}) => {
  return (
    <button className="transition opacity-0 rounded-full flex items-center p-4 bg-white group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 drop-shadow-md translate-y-1/4">
      <PlayCircle className="text-black" />
    </button>
  );
};

export default PlayButton;
