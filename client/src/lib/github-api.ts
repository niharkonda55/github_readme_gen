export interface GitHubUserData {
  name: string;
  bio: string;
  email: string;
  location: string;
  blog: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
}

export async function fetchGitHubUserData(username: string): Promise<GitHubUserData> {
  const response = await fetch(`/api/github/${username}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub data: ${response.statusText}`);
  }
  
  return response.json();
}
