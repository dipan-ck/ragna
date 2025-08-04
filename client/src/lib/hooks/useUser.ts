// hooks/useUser.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../queries/user';

export function useUser(user) {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    initialData: user,
    staleTime: 1000 * 60 * 5, 
    retry: 1,
  });
}
