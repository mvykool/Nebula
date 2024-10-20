import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadController } from './images.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '.uploads'), // Directory to serve static files from
      serveRoot: '/.uploads', // URL path for serving static files
    }),
  ],
  controllers: [UploadController],
})
export class imagesModule {}
