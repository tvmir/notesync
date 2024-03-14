'use client';

import { useAppState } from '@/lib/providers/state';
import { Notebook } from '@/types/supabase';
import { FC, useEffect, useMemo, useState } from 'react';
import NewNotebook from '../Notebooks/NewNotebook';
import CreationDialog from '../Notebooks/CreationDialog';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Menu, PlusCircleIcon } from 'lucide-react';
import clsx from 'clsx';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { PopoverContent } from '@radix-ui/react-popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import Link from 'next/link';
import { useModal } from '@/lib/providers/use-modal-state';
import { useMobile } from '@/lib/providers/use-mobile-state';

interface SidebarItemsProps {
  userNotebooks: Notebook[] | [];
  defaultNotebook: Notebook | undefined;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const SidebarItems: FC<SidebarItemsProps> = ({
  userNotebooks,
  defaultNotebook,
  defaultOpen,
  children,
}) => {
  const { setOpen } = useModal();
  const { isMobile } = useMobile();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { notebookId, state, dispatch } = useAppState();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
  }, [userNotebooks]); // eslint-disable-line react-hooks/exhaustive-deps

  defaultOpen = isMobile ? false : true;

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  if (!isMounted) return;

  return (
    <Sheet modal={false} {...openState}>
      <SheetTrigger
        asChild
        className="absolute left-4 top-3 z-[100] md:!hidden flex"
      >
        <Button variant="outline" size={'icon'}>
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        showX={!defaultOpen}
        side="left"
        className={clsx('bg-background fixed top-0 border-r-[1px] p-4', {
          'hidden md:inline-block z-0 w-[232px]': defaultOpen,
          'inline-block md:hidden z-[100] w-full': !defaultOpen,
        })}
      >
        <div>
          <Link href={`/dashboard/${notebookId}`}>
            <p className="hidden text-primary text-xl font-medium md:block pt-3">
              notesync
            </p>
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="w-full my-4 flex items-left justify-between"
                variant="subtle"
              >
                <div className="flex flex-col">{defaultNotebook?.title}</div>
                <div>
                  <ChevronsUpDown size={16} className="text-muted-foreground" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 h-[228px] border mt-4 ml-2 rounded-lg z-[200]">
              {
                <Command className="rounded-lg">
                  <CommandInput placeholder="Search Notebooks..." />
                  <CommandList className="pb-2">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Notebooks">
                      {userNotebooks.map((notebook) => (
                        <CommandItem key={notebook.id}>
                          {defaultOpen ? (
                            <Link
                              href={`/dashboard/${notebook.id}`}
                              className="flex gap-4 w-full h-full"
                            >
                              <div className="flex flex-col flex-1">
                                {notebook.title}
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/dashboard/${notebook.id}`}
                                className="flex gap-4 w-full h-full"
                              >
                                <div className="flex flex-col flex-1">
                                  {notebook.title}
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                  <Button
                    onClick={() => {
                      setOpen(
                        <CreationDialog
                          header="Create A Notebook"
                          content={<NewNotebook />}
                          description="Take organization to the next level."
                        />
                      );
                    }}
                    className="w-full flex gap-2"
                  >
                    <PlusCircleIcon size={15} />
                    Create a Notebook
                  </Button>
                </Command>
              }
            </PopoverContent>
          </Popover>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarItems;
