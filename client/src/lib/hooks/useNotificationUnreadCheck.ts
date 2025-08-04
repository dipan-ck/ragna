
'use client';

import { useQuery } from '@tanstack/react-query';
import { getNotificationStatus } from '../queries/notificationUnreadCheck';

export function useNotificationUnreadCheck() {
  return useQuery({
    queryKey: ['notificationUnreadCheck'],
    queryFn: getNotificationStatus,
    retry: 1,
  });
}
