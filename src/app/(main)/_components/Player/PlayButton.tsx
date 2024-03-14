import { Play } from 'lucide-react';
import { FC } from 'react';

const PlayButton: FC = () => {
  return (
    <button className="transition opacity-0 rounded-full flex items-center p-3 bg-primary group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 drop-shadow-md translate-y-1/4">
      <Play size={30} fill="#060e23" />
    </button>
  );
};

export default PlayButton;
