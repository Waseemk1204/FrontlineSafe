import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class UploadsService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private readonly configService: ConfigService) {
    const s3Config = this.configService.get('s3');
    this.bucket = s3Config.bucket;

    this.s3Client = new S3Client({
      region: s3Config.region,
      credentials: s3Config.accessKeyId
        ? {
            accessKeyId: s3Config.accessKeyId,
            secretAccessKey: s3Config.secretAccessKey,
          }
        : undefined,
      endpoint: s3Config.endpoint,
      forcePathStyle: s3Config.forcePathStyle,
    });
  }

  async generatePresignedUrl(
    filename: string,
    contentType: string,
    companyId?: string,
  ): Promise<{ uploadUrl: string; fileUrl: string; key: string; expiresIn: number }> {
    // Validate file type
    const appConfig = this.configService.get('app');
    const allowedTypes = appConfig.allowedFileTypes;

    if (!allowedTypes.includes(contentType)) {
      throw new BadRequestException(
        `File type ${contentType} not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      );
    }

    // Sanitize filename
    const sanitizedFilename = this.sanitizeFilename(filename);

    // Generate unique key
    const extension = path.extname(sanitizedFilename);
    const baseName = path.basename(sanitizedFilename, extension);
    const key = companyId
      ? `uploads/${companyId}/${uuidv4()}-${baseName}${extension}`
      : `uploads/${uuidv4()}-${baseName}${extension}`;

    // Generate presigned URL
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
      // Add ACL or other restrictions as needed
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    // Construct public file URL
    const s3Config = this.configService.get('s3');
    let fileUrl: string;
    if (s3Config.endpoint) {
      // DigitalOcean Spaces or custom endpoint
      fileUrl = `${s3Config.endpoint}/${this.bucket}/${key}`;
    } else {
      // AWS S3
      fileUrl = `https://${this.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;
    }

    return {
      uploadUrl,
      fileUrl,
      key,
      expiresIn: 3600,
    };
  }

  private sanitizeFilename(filename: string): string {
    // Remove path traversal attempts
    let sanitized = path.basename(filename);

    // Remove or replace dangerous characters
    sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Limit length
    if (sanitized.length > 255) {
      const ext = path.extname(sanitized);
      sanitized = sanitized.substring(0, 255 - ext.length) + ext;
    }

    return sanitized;
  }
}

