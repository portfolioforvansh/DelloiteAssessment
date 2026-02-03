export const apiClient = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('API failed');
  return res.json();
};
