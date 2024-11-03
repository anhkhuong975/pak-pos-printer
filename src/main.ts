import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const APP_NAME = 'POS PRINTER';
const SWAGGER_PATH = 'api-document';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle(`${APP_NAME} - API`)
    .setDescription('Description')
    .setVersion('1.0')
    .addTag(`${APP_NAME}_API`)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);

  await app.listen(3000);
}

bootstrap().then();
