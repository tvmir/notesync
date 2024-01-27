import { FC } from 'react';
import Image from 'next/legacy/image';
import { AvatarProps } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps extends AvatarProps {
  user: any;
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
      <Avatar {...props} className="rounded-xl">
        {user?.image ? (
          <div className="relative aspect-square">
            <Image
              layout="fill"
              priority
              src={user?.image}
              alt="profile image"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <AvatarFallback>
            <span className="sr-only">{user?.name}</span>
            {/* <Icons.user className="h-4 w-4" /> */}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="text-primary text-md font-medium">{user?.name}</div>
    </div>
  );
};

export default UserAvatar;
