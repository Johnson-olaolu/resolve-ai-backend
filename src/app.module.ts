import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { DatabaseModule } from './database/database.module';
import { FileModule } from './file/file.module';
import { ServicesModule } from './services/services.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables, validateEnv } from './config/env.config';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import KeyvRedis from '@keyv/redis';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnv,
      isGlobal: true,
    }),
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        secret: configService.get('JWT_SECRET_KEY'),
      }),
      global: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        const redisHost = configService.get<string>('REDIS_HOST');
        const redisPort = configService.get<number>('REDIS_PORT');
        const redisUsername = configService.get<string>('REDIS_USERNAME');
        const redisPassword = configService.get<string>('REDIS_PASSWORD');
        const nodeEnv = configService.get<string>('NODE_ENV');
        const enableTls = nodeEnv !== 'development';

        // Use 'rediss://' (double s) when TLS is enabled
        let redisUrl = enableTls ? `rediss://` : `redis://`;

        if (redisUsername && redisPassword) {
          redisUrl += `${redisUsername}:${redisPassword}@`;
        } else if (redisPassword) {
          redisUrl += `:${redisPassword}@`;
        }

        redisUrl += `${redisHost}:${redisPort}`;

        // const tlsOptions = enableTls
        //   ? {
        //       rejectUnauthorized: false, // For self-signed ElastiCache certs
        //       // Optional: provide custom CA certificate if needed
        //       // ca: [fs.readFileSync('/path/to/ca-cert.pem')],
        //     }
        //   : undefined;

        return {
          stores: [new KeyvRedis(redisUrl)],
        };
      },
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        prefix: '{bull}',
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD') ?? undefined,
          username: configService.get<string>('REDIS_USERNAME') ?? undefined,
          tls:
            configService.get<string>('NODE_ENV') !== 'development'
              ? {}
              : undefined,
          maxRetriesPerRequest: null, // 🛠️ Prevents creating new clients when a request fails
          enableOfflineQueue: false, // 🚀 Allow queuing commands when the connection is down
          enableReadyCheck: false, // ✅ Ensures the client is ready before processing commands
        },
        sharedConnection: true, // ✅ Use a single Redis connection for all queues
      }),
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    AuthModule,
    UserModule,
    NotificationModule,
    DatabaseModule,
    FileModule,
    ServicesModule,
    WalletModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
