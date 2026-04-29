import { auth } from './firebase';

async function getAuthHeader(): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentification requise');
  }
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function uploadFile(file: File, folder: 'projects' | 'audio' | 'audio-covers'): Promise<string> {
  const headers = await getAuthHeader();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Upload échoué (${res.status})`);
  }
  return data.url as string;
}

export async function deleteFile(url: string): Promise<void> {
  const headers = await getAuthHeader();
  const res = await fetch('/api/delete-file', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Suppression échouée (${res.status})`);
  }
}
