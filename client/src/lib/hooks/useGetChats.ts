
'use client';

import { useQuery } from '@tanstack/react-query';
import { getChats } from '../queries/getChats';

export function useGetChats(projectId: string, before?: string, limit = 20) {
  return useQuery({
    queryKey: ['chats', projectId, before],
    queryFn: () => getChats(projectId, before, limit),
    staleTime: 0,
    cacheTime: 0,
    retry: 1,
    enabled: !!projectId, // Only run if projectId exists
  });
}
