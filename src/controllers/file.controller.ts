import { Request, Response } from 'express';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '../config/s3.js';
import { config } from '../config/index.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { BadRequestError } from '../utils/ApiError.js';

export const FileController = {
    getSignedUrl: catchAsync(async (req: Request, res: Response) => {
        const { fileName, fileType } = req.query;
        if (!fileName || !fileType) throw new BadRequestError('fileName and fileType are required');

        const key = `uploads/${Date.now()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: config.S3_BUCKET_NAME,
            Key: key,
            ContentType: fileType as string,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        res.json(new ApiResponse(200, { uploadUrl, key }, 'Signed URL generated successfully'));
    }),

    getDownloadUrl: catchAsync(async (req: Request, res: Response) => {
        const { key } = req.query;
        if (!key) throw new BadRequestError('key is required');

        const command = new GetObjectCommand({
            Bucket: config.S3_BUCKET_NAME,
            Key: key as string,
        });

        const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        res.json(new ApiResponse(200, { downloadUrl }, 'Download URL generated successfully'));
    }),
};
