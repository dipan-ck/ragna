
export async function fetchUser(){
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me`, {
      credentials: 'include',
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch user');
    }
  
    const result = await res.json();
    return result.data;
  }
  