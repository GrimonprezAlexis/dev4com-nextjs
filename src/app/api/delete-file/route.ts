import { NextResponse } from 'next/server';
import { deleteFromS3 } from '@/lib/s3';
import { requireAuth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    try {
      await requireAuth(request);
    } catch {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL manquante' }, { status: 400 });
    }

    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) {
      return NextResponse.json({ error: 'Bucket non configuré' }, { status: 500 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: 'URL invalide' }, { status: 400 });
    }

    if (!parsed.hostname.startsWith(`${bucket}.s3.`)) {
      return NextResponse.json({ error: 'URL n\'appartient pas au bucket' }, { status: 400 });
    }

    await deleteFromS3(url);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: `Échec suppression: ${message}` }, { status: 500 });
  }
}
