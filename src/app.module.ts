import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { NoticeModule } from './notice/notice.module';
import { FaqModule } from './faq/faq.module';
import { QnaModule } from './qna/qna.module';

@Module({
  imports: [
    // env 설정
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // typeORM 설정
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_SECRET,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
      logging: process.env.NODE_ENV === 'development' ? true : false,
    }),
    // mailer
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: `smtps://${process.env.EMAIL_AUTH_EMAIL}:${process.env.EMAIL_AUTH_PASSWORD}@${process.env.EMAIL_HOST}`,
        defaults: {
          from: `"${process.env.EMAIL_FROM_USER_NAME}" <${process.env.EMAIL_AUTH_EMAIL}>`,
        },
      }),
    }),
    // cache
    CacheModule.register({
      isGlobal: true, // 전역으로 사용가능
      ttl: 5, // 디폴트 만료시간
    }),
    // app module
    NoticeModule,
    UsersModule,
    EmailModule,
    AuthModule,
    UploadModule,
    FaqModule,
    QnaModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
