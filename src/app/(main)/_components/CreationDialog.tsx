import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import clsx from 'clsx';
import { FC } from 'react';

interface CreationDialogProps {
  header?: string;
  content?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  className?: string;
}

const CreationDialog: FC<CreationDialogProps> = ({
  header,
  content,
  children,
  description,
  className,
}) => {
  return (
    <Dialog>
      <DialogTrigger className={clsx('', className)}>{children}</DialogTrigger>
      <DialogContent className="block overflow-scroll w-full">
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default CreationDialog;
