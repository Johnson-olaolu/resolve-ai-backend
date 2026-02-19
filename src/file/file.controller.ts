import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  HttpStatus,
} from '@nestjs/common';
import { FileService } from './file.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FileFoldersEnum } from 'src/utils/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('file')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
        },
        label: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1e7 }),
          // new FileTypeValidator({ fileType: 'image/*' }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: User,
    @Body('folder') folder: FileFoldersEnum,
    @Body('label') label: string,
  ) {
    const data = await this.fileService.createFile(
      {
        file,
        folder,
        label,
      },
      user,
    );
    return {
      message: 'File uploaded successfully',
      data,
      success: true,
    };
  }

  // @Get()
  // findAll() {
  //   return this.fileService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.fileService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   return this.fileService.update(+id, updateFileDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.fileService.deleteFile(id);
    return {
      message: 'File deleted successfully',
      data,
      success: true,
    };
  }
}
