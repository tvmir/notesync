import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

const Navbar = async () => {
  return (
    <div className="backdrop-blur-sm bg-background z-50 h-20 shadow-sm">
      <div className="container p-4 mx-auto w-full flex justify-between items-center">
        <Link href="/" className="flex gap-2 items-center">
          <p className="hidden text-primary text-xl font-medium md:block">
            notesync
          </p>
        </Link>
        <Link href="/login" className={buttonVariants()}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
