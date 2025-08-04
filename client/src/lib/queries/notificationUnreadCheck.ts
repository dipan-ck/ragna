
  

  export async function getNotificationStatus() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/notification/unread-status`, {
      method: 'GET',
      credentials: 'include',
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch user');
    }
  
    const result = await res.json();
    return result.hasUnread; 
  }
  