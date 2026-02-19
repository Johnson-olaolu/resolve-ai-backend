import { Global, Module } from '@nestjs/common';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { GoogleModule } from './google/google.module';

@Global()
@Module({
  imports: [CloudinaryModule, GoogleModule],
  exports: [CloudinaryModule, GoogleModule],
})
export class ServicesModule {}
