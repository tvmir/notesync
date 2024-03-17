import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabaseServer = () => {
  cookies().getAll();
  return createServerComponentClient({ cookies });
};

export default supabaseServer;
