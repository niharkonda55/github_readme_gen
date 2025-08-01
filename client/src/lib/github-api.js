export async function fetchGitHubUserData(username) {
  const response = await fetch(`/api/github/${username}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub data: ${response.statusText}`);
  }
  
  return response.json();
}