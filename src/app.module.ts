import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { DatabaseModule } from './database/database.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [AuthModule, UserModule, NotificationModule, DatabaseModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
