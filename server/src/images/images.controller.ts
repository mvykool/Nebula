import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

// Define storage options
const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Specify the folder where files will be stored
      cb(null, 'dist/uploads');
    },
    filename: (req, file, cb) => {
      // Create a unique file name
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split('.').pop();
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Accept only certain file types
    if (['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
};

@Controller('upload')
export class UploadController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    // Return the URL where the file can be accessed
    return { url: `/.uploads/${file.filename}` };
  }
}
