import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/lib/providers/use-modal-state';
import clsx from 'clsx';
import { FC } from 'react';

interface CreationDialogProps {
  header: string;
  content: React.ReactNode;
  children?: React.ReactNode;
  description: string;
  className?: string;
  defaultOpen?: boolean;
}

const CreationDialog: FC<CreationDialogProps> = ({
  header,
  content,
  description,
  defaultOpen,
}) => {
  const { isOpen, setClose } = useModal();

  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
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
