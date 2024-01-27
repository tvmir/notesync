'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface EmojiPickerProps {
  children: React.ReactNode;
  getEmoji?: (emoji: string) => void;
}

const EmojiPicker: FC<EmojiPickerProps> = ({ children, getEmoji }) => {
  const Picker = dynamic(() => import('emoji-picker-react'));
  const router = useRouter();

  const onClick = (selectedEmoji: any) => {
    if (getEmoji) getEmoji(selectedEmoji.emoji);
  };

  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger className="cursor-pointer">{children}</PopoverTrigger>
        <PopoverContent className="p-0 border-none">
          <Picker onEmojiClick={onClick} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EmojiPicker;
