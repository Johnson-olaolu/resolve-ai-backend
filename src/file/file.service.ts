import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env.config';
import { CreateFilesDto } from './dto/create-files.dto';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async createFile(createFileDto: CreateFileDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const file = this.fileRepository.create({
        user: user,
        label: createFileDto.label,
        folder: createFileDto.folder,
        fileName: createFileDto.file.originalname,
        mimeType: createFileDto.file.mimetype,
        size: createFileDto.file.size,
      });
      const savedFile = await queryRunner.manager.save(file);
      const metadata = {
        userId: user.id,
        fileId: savedFile.id,
        label: createFileDto.label,
        fileName: createFileDto.file.originalname,
        folder: createFileDto.folder,
      };
      const cloudinaryResponse = await this.cloudinaryService.upload(
        createFileDto.file,
        createFileDto.folder,
        metadata,
      );
      savedFile.publicId = cloudinaryResponse.public_id;
      savedFile.url = cloudinaryResponse.secure_url;
      await queryRunner.manager.save(savedFile);
      await queryRunner.commitTransaction();
      return savedFile;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to create file: ${error?.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async createFiles(createFilesDto: CreateFilesDto, user: User) {
    const files = await Promise.all(
      createFilesDto.files.map((file) => {
        const createFileDto: CreateFileDto = {
          ...createFilesDto,
          file,
        };
        return this.createFile(createFileDto, user);
      }),
    );
    return files;
  }

  async findFileById(id: string) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new InternalServerErrorException(`File not found`);
    }
    return file;
  }

  async deleteFile(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const file = await this.fileRepository.findOne({ where: { id } });
      if (!file) {
        throw new InternalServerErrorException(`File not found`);
      }
      await this.cloudinaryService.delete(file.publicId);
      await queryRunner.manager.delete(File, { id });
      await queryRunner.commitTransaction();
      return true;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to delete file: ${error?.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
