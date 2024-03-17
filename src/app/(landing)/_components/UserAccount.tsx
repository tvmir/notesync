'use client';

import { FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import UserAvatar from './UserAvatar';
import { useToast } from '@/components/ui/use-toast';
import { redirect, useRouter } from 'next/navigation';
import { AuthUser } from '@supabase/supabase-js';
import { useMobile } from '@/lib/providers/use-mobile-state';
import { createSupabaseBrowserClient } from '@/lib/supabase/supabase-browser';

interface UserAccountProps {
  user: AuthUser;
}

const UserAccount: FC<UserAccountProps> = ({ user }) => {
  const router = useRouter();
  const { isMobile } = useMobile();
  const { toast } = useToast();

  const signOutWithGoogle = async () => {
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: 'There was a problem',
        description:
          'There was an error signing out with Google. Please try again.',
        variant: 'destructive',
      });
    }

    router.refresh();
    router.replace('/');
  };

  return (
    <>
      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            {isMobile ? (
              <UserAvatar
                user={{
                  user_metadata: {
                    avatar_url: user.user_metadata?.avatar_url,
                  },
                }}
                isMobile={isMobile}
                className="h-4 w-4"
              />
            ) : (
              <UserAvatar
                user={{
                  user_metadata: {
                    name: user.user_metadata?.name,
                    avatar_url: user.user_metadata?.avatar_url,
                  },
                }}
                className="h-4 w-4"
              />
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className={cn('bg-background mt-2 mr-4')}
            align="end"
          >
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user.user_metadata?.name && (
                  <p className="font-medium">{user.user_metadata?.name}</p>
                )}
                {user.email && (
                  <p className="w-[200px] truncate text-sm text-primary">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                signOutWithGoogle();
              }}
              className="cursor-pointer"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default UserAccount;
