'use client';

import { FC, useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import UserAvatar from './UserAvatar';

interface UserAccountProps {
  user: any;
}

const UserAccount: FC<UserAccountProps> = ({ user }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // useEffect(() => {
  //   const mobileMediaQuery = window.matchMedia('(max-width: 768px)');

  //   const handleMobileChange = (event: any) => {
  //     setIsMobile(event.matches);
  //   };

  //   mobileMediaQuery.addEventListener('change', handleMobileChange);
  //   setIsMobile(mobileMediaQuery.matches);

  //   return () => {
  //     mobileMediaQuery.removeEventListener('change', handleMobileChange);
  //   };
  // }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        {isMobile ? (
          <UserAvatar
            user={{
              image: user?.image || null,
            }}
            isMobile={isMobile}
            className="h-6 w-6"
          />
        ) : (
          <UserAvatar
            user={{
              name: user?.name || null,
              image: user?.image || null,
            }}
            className="h-8 w-8"
          />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn('bg-background mt-2 mr-4')}
        align="end"
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.name && <p className="font-medium">{user?.name}</p>}
            {user?.email && (
              <p className="w-[200px] truncate text-sm text-primary">
                {user?.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/">Home</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            // signOut({
            //   callbackUrl: `${window.location.origin}/signin}`,
            // });
          }}
          className="cursor-pointer"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccount;
