import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { FileFoldersEnum } from 'src/utils/constants';
import { EnvironmentVariables } from 'src/config/env.config';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private logger = new Logger(CloudinaryService.name);
  constructor(private configService: ConfigService<EnvironmentVariables>) {
    cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async upload(
    file: Express.Multer.File,
    folder: FileFoldersEnum,
    metadata?: Record<string, string>,
  ) {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `${this.configService.get('APP_NAME')}-${folder}`,
          context: metadata,
        },
        (error, response) => {
          if (error) reject(error as Error);
          return resolve(response);
        },
      );
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      readableStream.pipe(upload);
    })
      .then((response: UploadApiResponse) => {
        this.logger.log(
          `Buffer upload_stream with promise success - ${response.public_id}`,
        );
        return response;
      })
      .catch((error: UploadApiErrorResponse) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  async delete(publicId: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .destroy(publicId)
        .then((result) => resolve(result))
        .catch((error) => reject(error as Error));
    })
      .then((response) => {
        this.logger.log(`Deleted file with public ID: ${publicId}`);
        return response;
      })
      .catch((error: UploadApiErrorResponse) => {
        throw new InternalServerErrorException(error.message);
      });
  }
}
