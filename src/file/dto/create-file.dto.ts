import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FileFoldersEnum } from 'src/utils/constants';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsEnum(FileFoldersEnum)
  folder: FileFoldersEnum;

  file: Express.Multer.File;
}
