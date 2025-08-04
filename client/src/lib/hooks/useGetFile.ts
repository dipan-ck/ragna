
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFiles } from '../queries/file';

export function useGetFile(id: string) {
  return useQuery({
    queryKey: ['file', id],
    queryFn: () => fetchFiles(id),
    staleTime: 1000 * 60 * 5, 
    retry: 1,
  });
}
