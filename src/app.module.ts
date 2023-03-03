import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    // env 설정
    ConfigModule.forRoot({isGlobal: true}),
    // typeORM 설정
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_SECRET,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
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
    // app module
    UsersModule,
    EmailModule,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
