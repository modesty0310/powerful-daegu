import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { string0To1000 } from 'aws-sdk/clients/customerprofiles';
import { PromiseResult } from 'aws-sdk/lib/request';

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

    async uploadFileToS3(
        folder: string,
        file: Express.Multer.File
    ): Promise<{
        key: string;
        s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
        contentType: string;
        url: string
    }> {
        console.log(file);
        
        try {
            const key = `${folder}/${Date.now()}_${Buffer.from(file.originalname, 'latin1').toString('utf-8')}`.replace(/ /g, '');
            console.log(key);
            
            const s3Object = await this.awsS3
            .putObject({
                Bucket: this.S3_BUCKET_NAME,
                Key: key,
                Body: file.buffer,
                ACL: 'public-read',
                ContentType: file.mimetype,
            })
            .promise();
            const url = decodeURIComponent(await this.getUrl(key));
            return { key, s3Object, contentType: file.mimetype, url };
          } catch (error) {
            throw new BadRequestException(`File upload failed : ${error}`);
          }
    }

    async getUrl(key: string0To1000) {
        const params = { Bucket: this.S3_BUCKET_NAME, Key: key };

        const imageUrl: string = await new Promise((r) => 
            this.awsS3.getSignedUrl('getObject', params, async (err, url) => {
                if (err) {
                    throw err;
                }
                r(url.split('?')[0]); //  return object url
            }),
        );
        return imageUrl;
    }

    async deleteS3Object(
        key: string,
        callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void,
    ): Promise<{ success: true }> {
        try {            
            await this.awsS3.deleteObject(
                {
                    Bucket: this.S3_BUCKET_NAME,
                    Key: key,
                },
                callback,
            )
            .promise();
            return { success: true };
        } catch (error) {
            throw new BadRequestException(`Failed to delete file : ${error}`);
        }
    }
}
