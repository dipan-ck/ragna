
'use client';

import { useQuery } from '@tanstack/react-query';
import {getProject } from '../queries/project';

export function useGetProject(projectId: string, initial?: any) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId),
    initialData: initial,
    staleTime: 1000 * 60 * 5, 
    retry: 1,
  });
}
