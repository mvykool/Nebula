import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //swagger docs
  const configuration = new DocumentBuilder()
    .setTitle('Nebula')
    .setDescription('API for nebula')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, configuration);

  SwaggerModule.setup('api', app, document);

  const options = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
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
