import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { winstonLogger } from './common/utils/winston.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // winston 추가
    logger: winstonLogger
  });

  // swagger 추가
  const config = new DocumentBuilder()
    .setTitle('대구 아동 급식카드 앱')
    .setDescription('대구 아동 급식카드 API문서')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
