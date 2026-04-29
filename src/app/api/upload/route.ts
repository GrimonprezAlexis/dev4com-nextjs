import { NextResponse } from 'next/server';
import { uploadBufferToS3 } from '@/lib/s3';
import { requireAuth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ALLOWED_FOLDERS = new Set(['projects', 'audio', 'audio-covers']);

const MAX_BYTES_BY_FOLDER: Record<string, number> = {
  projects: 10 * 1024 * 1024,
  'audio-covers': 5 * 1024 * 1024,
  audio: 50 * 1024 * 1024,
};

const ALLOWED_PREFIX_BY_FOLDER: Record<string, string> = {
  projects: 'image/',
  'audio-covers': 'image/',
  audio: 'audio/',
};

export async function POST(request: Request) {
  try {
    try {
      await requireAuth(request);
    } catch {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = String(formData.get('folder') || '');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }

    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: 'Dossier non autorisé' }, { status: 400 });
    }

    const maxBytes = MAX_BYTES_BY_FOLDER[folder];
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `Fichier trop volumineux (max ${Math.round(maxBytes / 1024 / 1024)}MB)` },
        { status: 413 }
      );
    }

    const expectedPrefix = ALLOWED_PREFIX_BY_FOLDER[folder];
    if (!file.type.startsWith(expectedPrefix)) {
      return NextResponse.json({ error: 'Type de fichier invalide' }, { status: 415 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadBufferToS3(buffer, file.type, file.name, folder);

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: `Échec de l'upload: ${message}` }, { status: 500 });
  }
}
