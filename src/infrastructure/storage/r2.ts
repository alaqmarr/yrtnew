import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";
import { siteSettingRepository } from "@/modules/site-settings/repository/site-setting.repository";

export interface UploadResult {
  url: string;
  key: string;
  storage: "r2" | "local";
}

/**
 * Dynamically resolves Cloudflare R2 client from database site_settings (with env fallback)
 */
async function getR2Config() {
  const settings = await siteSettingRepository.getAllAsMap();

  const accountId = settings.r2_account_id || process.env.R2_ACCOUNT_ID || "";
  const accessKeyId = settings.r2_access_key_id || process.env.R2_ACCESS_KEY_ID || "";
  const secretAccessKey = settings.r2_secret_access_key || process.env.R2_SECRET_ACCESS_KEY || "";
  const bucketName = settings.r2_bucket_name || process.env.R2_BUCKET_NAME || "";
  const publicUrl = settings.r2_public_url || process.env.R2_PUBLIC_URL || "";

  const isConfigured = Boolean(accountId && accessKeyId && secretAccessKey && bucketName);

  let client: S3Client | null = null;
  if (isConfigured) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return {
    isConfigured,
    client,
    accountId,
    bucketName,
    publicUrl,
  };
}

/**
 * Uploads a file buffer either to database-controlled Cloudflare R2 or local /public/uploads/ directory
 */
export async function uploadMedia(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<UploadResult> {
  const sanitizedFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const r2 = await getR2Config();

  // If Cloudflare R2 is configured in database or env, upload to R2
  if (r2.isConfigured && r2.client && r2.bucketName) {
    const key = `gallery/${sanitizedFilename}`;
    await r2.client.send(
      new PutObjectCommand({
        Bucket: r2.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const publicUrl = r2.publicUrl
      ? `${r2.publicUrl.replace(/\/$/, "")}/${key}`
      : `https://${r2.bucketName}.${r2.accountId}.r2.cloudflarestorage.com/${key}`;

    return {
      url: publicUrl,
      key,
      storage: "r2",
    };
  }

  // Fallback to local storage in /public/uploads/
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, sanitizedFilename);
  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/${sanitizedFilename}`,
    key: sanitizedFilename,
    storage: "local",
  };
}

/**
 * Delete a media object by key
 */
export async function deleteMedia(key: string, storage: "r2" | "local"): Promise<void> {
  const r2 = await getR2Config();

  if (storage === "r2" && r2.isConfigured && r2.client && r2.bucketName) {
    try {
      await r2.client.send(
        new DeleteObjectCommand({
          Bucket: r2.bucketName,
          Key: key,
        })
      );
    } catch (err) {
      console.error("Failed to delete from R2:", err);
    }
  } else {
    try {
      const filePath = path.join(process.cwd(), "public", "uploads", path.basename(key));
      await fs.unlink(filePath);
    } catch {
      // File may already be removed
    }
  }
}
