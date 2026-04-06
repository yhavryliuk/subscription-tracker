import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './env.validation';
import throttlerConfigFactory from './throttler-config';
import cacheConfigFactory from './cache.config';
import { ThrottlerConfigService } from './throttler.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envValidationSchema,
      load: [throttlerConfigFactory, cacheConfigFactory],
    }),
  ],
  providers: [ThrottlerConfigService],
  exports: [ThrottlerConfigService],
})
export class AppConfigModule {}
