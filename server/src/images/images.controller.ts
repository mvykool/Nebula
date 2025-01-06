import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImgurClient } from 'imgur';
import { Multer } from 'multer';

@Controller('upload')
export class UploadController {
  private readonly imgurClient: ImgurClient;

  constructor() {
    // Initialize the ImgurClient with your client ID
    this.imgurClient = new ImgurClient({
      clientId: process.env.IMGUR_ID,
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      // Convert buffer to base64
      const base64Image = file.buffer.toString('base64');

      // Upload the image to Imgur
      const response = await this.imgurClient.upload({
        image: base64Image,
        type: 'base64',
      });

      // Check if the upload was successful
      if (!response.success) {
        throw new Error('Upload failed');
      }

      // Return the URL of the uploaded image
      return { url: response.data.link };
    } catch (error) {
      console.error('Imgur upload error:', error);
      throw new HttpException(
        'Failed to upload image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
