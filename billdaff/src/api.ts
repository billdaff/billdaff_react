export const API_ORIGIN = 'https://drupal.billdaff.com';

export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_ORIGIN}/api/${path}`);
  if (!response.ok) {
    throw new Error(`Request for ${path} failed with status ${response.status}`);
  }
  return response.json();
}

export const RESUME_ARTICLE_TITLES = [
  'Education',
  'Qualifications and Technology Experience',
  'Notable Projects',
  'Services and Solutions',
];
