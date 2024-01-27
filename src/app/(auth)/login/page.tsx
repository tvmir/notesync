'use client';

import UserAuthForm from '@/app/(landing)/_components/UserAuth';
import Link from 'next/link';
import { FC } from 'react';

const Login: FC = () => {
  return (
    <>
      <div className="md:hidden">
        <p className="hidden text-primary text-xl font-medium md:block">
          notesync
        </p>
      </div>
      <div className="container relative hidden h-full items-center justify-center md:grid lg:max-w-none lg:grid-cols-1">
        <div className="">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                notesync
              </h1>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
