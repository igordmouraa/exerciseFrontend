export const API = "https://jsonplaceholder.typicode.com";

export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
  return response.json() as Promise<T>;
}
