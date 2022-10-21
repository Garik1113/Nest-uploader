import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { fileInterceptor } from './file.interceptor';
import { AuthGuard } from './auth.guard';
import { Roles } from './roles.decorator';

@Controller()
export class AppController {
  @Post('upload')
  @Roles('seller')
  @UseGuards(AuthGuard)
  @UseInterceptors(fileInterceptor())
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      path: file.path,
    };
  }
}
