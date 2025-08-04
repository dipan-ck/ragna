

export async function fetchProjects(){
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/get`, {
        credentials: "include"
      });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch Projects');
    }
  
    const result = await res.json();
    return result.data;
  }
  

  export async function getProject(projectId){
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/get/${projectId}`, {
      credentials: "include", 
    });

      
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch Projects');
    }
  
    const result = await res.json();
    return result.data;
  }