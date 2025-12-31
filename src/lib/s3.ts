import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Fonction pour obtenir le client S3 avec validation
function getS3Client() {
  const region = process.env.NEXT_PUBLIC_AWS_REGION;
  const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials are not configured. Please check your .env file.');
  }

  return new S3Client({
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
}

const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;

export async function uploadToS3(file: File, folder: string): Promise<string> {
  try {
    if (!bucketName) {
      throw new Error('S3 bucket name is not configured');
    }

    const s3Client = getS3Client();

    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
    const key = `${folder}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    try {
      await s3Client.send(command);
    } catch (s3Error: any) {
      console.error('S3 send command error:', s3Error);
      throw new Error(`S3 upload failed: ${s3Error.message || s3Error.name || 'Unknown S3 error'}`);
    }

    const region = process.env.NEXT_PUBLIC_AWS_REGION;
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    return publicUrl;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
  try {
    if (!bucketName) {
      throw new Error('S3 bucket name is not configured');
    }

    const s3Client = getS3Client();

    const url = new URL(fileUrl);
    const key = url.pathname.substring(1);

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error(`Failed to delete file from S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function generateS3Key(filename: string, folder: string): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/\s+/g, '-');
  return `${folder}/${timestamp}-${sanitizedFilename}`;
}
