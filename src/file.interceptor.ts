import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const fileTypeFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback('Unexpected file type', false);
  }
  callback(null, true);
};

export const fileInterceptor = () =>
  FileInterceptor('file', {
    storage: diskStorage({
      destination: `./uploads`,
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const randomName =
          Math.round(Math.random() * 16).toString(16) + new Date().getTime();
        cb(null, `${randomName}-${name}${extname(file.originalname)}`);
      },
    }),
    limits: {
      fileSize: Number(process.env.MAX_FILE_SIZE),
    },
    fileFilter: fileTypeFilter,
  });
