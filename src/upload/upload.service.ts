import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import * as path from 'path';

@Injectable()
export class UploadService {
    private readonly awsS3: AWS.S3;
    public readonly S3_BUCKET_NAME: string;

    constructor() {
        this.awsS3 = new AWS.S3({
          accessKeyId: process.env.AWS_S3_ACCESS_KEY, // process.env.AWS_S3_ACCESS_KEY
          secretAccessKey: process.env.AWS_S3_SECRET_KEY,
          region: process.env.AWS_S3_REGION,
        });
        this.S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME; // nest-s3
    }

    async uploadImage(
        folder: string,
        file: Express.Multer.File
    ): Promise<{
        key: string;
        s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
        contentType: string;
    }> {
        try {
            const key = `${folder}/${Date.now()}_${path.basename(
              file.originalname,
            )}`.replace(/ /g, '');
      
            const s3Object = await this.awsS3
              .putObject({
                Bucket: this.S3_BUCKET_NAME,
                Key: key,
                Body: file.buffer,
                ACL: 'public-read',
                ContentType: file.mimetype,
             })
            .promise();
            return { key, s3Object, contentType: file.mimetype };
          } catch (error) {
            throw new BadRequestException(`File upload failed : ${error}`);
          }
    }
}
