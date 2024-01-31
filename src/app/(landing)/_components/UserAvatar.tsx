import { FC } from 'react';
import Image from 'next/legacy/image';
import { AvatarProps } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from '@/types/supabase';
import { Icons } from '@/components/Icons';
import { AuthUser } from '@supabase/supabase-js';

interface UserAvatarProps extends AvatarProps {
  user: Partial<AuthUser>;
  isMobile?: boolean;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, isMobile, ...props }) => {
  return (
    <div
      className={cn(
        'flex justify-center items-center gap-4 h-full w-full focus:outline-none',
        isMobile && 'gap-0'
      )}
    >
      <div className="text-primary text-md font-medium">
        {user.user_metadata?.name}
      </div>
      <Avatar {...props} className="rounded-full">
        {user.user_metadata?.avatar_url ? (
          <div className="relative aspect-square">
            <Image
              layout="fill"
              priority
              src={user.user_metadata?.avatar_url}
              alt="profile image"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <AvatarFallback>
            <span className="sr-only">{user.user_metadata?.name}</span>
            <Icons.user className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>
    </div>
  );
};

export default UserAvatar;
