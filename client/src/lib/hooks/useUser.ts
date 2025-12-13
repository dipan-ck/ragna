// hooks/useUser.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../queries/user';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}
