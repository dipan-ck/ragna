
// export async function getChats(projectId: string) {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/get-chats`, {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ projectId }), 
//     });
  
//     if (!res.ok) {
//       const error = await res.json();
//       throw new Error(error.message || 'Failed to fetch user');
//     }
  
//     const result = await res.json();
//     return result.data;
//   }  
  

  export async function getChats(projectId: string, before?: string, limit = 20) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/get-chats`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId, before, limit }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch chats');
  }

  const result = await res.json();
  return result.data; // this should be an array of chats
}
