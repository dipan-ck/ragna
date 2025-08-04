
'use client';

import { useQuery } from '@tanstack/react-query';
import { getChats } from '../queries/getChats';

export function useGetChats(projectId: string, before?: string, limit = 20) {
  return useQuery({
    queryKey: ['chats', projectId, before],
    queryFn: () => getChats(projectId, before, limit),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
