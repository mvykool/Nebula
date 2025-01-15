import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  //swagger docs
  const configuration = new DocumentBuilder()
    .setTitle('Nebula')
    .setDescription('API for nebula')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, configuration);

  SwaggerModule.setup('api', app, document);

  const options = {
    origin: ['https://nebula-client.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  };

  app.enableCors(options);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();
