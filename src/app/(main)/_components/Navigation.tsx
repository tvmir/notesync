import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FC } from 'react';

interface NavigationProps {
  currentNotebookId: string;
  className?: string;
  getSelectedItem?: (selection: string) => void;
}

const Navigation: FC<NavigationProps> = ({
  className,
  getSelectedItem,
  currentNotebookId,
}) => {
  return (
    <nav className={cn('my-2', className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            href={`/dashboard/${currentNotebookId}`}
            className="group/native flex text-primary transition-all gap-2"
          >
            <span className="text-sm">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            href={`/dashboard/trash`}
            className="group/native flex text-primary transition-all gap-2"
          >
            <span className="text-sm">Trash</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
