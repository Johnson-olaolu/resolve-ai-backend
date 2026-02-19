import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { FileFoldersEnum } from 'src/utils/constants';
// import { IsFiles } from 'nestjs-form-data';

export class CreateFilesDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsEnum(FileFoldersEnum)
  folder: FileFoldersEnum;

  @IsUUID()
  ownerId: string;

  // @IsFiles()
  files: Express.Multer.File[];
}
