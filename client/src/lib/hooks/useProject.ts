
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../queries/project';

export function useProject(serverProject?: any[]) {
  return useQuery({
    queryKey: ['project'],
    queryFn: fetchProjects,
    initialData: serverProject,
    staleTime: 1000 * 60 * 5, 
    retry: 1,
  });
}
