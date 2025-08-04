// Fetch files for a given project. Expects projId as the key for project id.
export async function fetchFiles(projId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/file/get`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projId }), 
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch user');
  }

  const result = await res.json();
  return result.data;
}  
