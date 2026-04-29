import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

function getS3Client() {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials are not configured. Please check your .env file.');
  }

  return new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
}

const bucketName = process.env.AWS_S3_BUCKET;

export async function uploadBufferToS3(
  buffer: Buffer,
  contentType: string,
  originalName: string,
  folder: string
): Promise<string> {
  if (!bucketName) {
    throw new Error('S3 bucket name is not configured');
  }

  const s3Client = getS3Client();
  const region = process.env.AWS_REGION;

  const timestamp = Date.now();
  const sanitized = originalName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
  const key = `${folder}/${timestamp}-${sanitized}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
  if (!bucketName) {
    throw new Error('S3 bucket name is not configured');
  }

  const s3Client = getS3Client();
  const url = new URL(fileUrl);
  const key = url.pathname.substring(1);

  await s3Client.send(
    new DeleteObjectCommand({ Bucket: bucketName, Key: key })
  );
}
