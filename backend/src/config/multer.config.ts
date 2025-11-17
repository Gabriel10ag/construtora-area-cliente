    import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const timestamp = Date.now();
      const random = Math.round(Math.random() * 99999);
      const ext = extname(file.originalname);
      const clean = file.originalname
        .replace(ext, '')
        .replace(/[^a-zA-Z0-9]/g, '-');

      callback(null, `${clean}-${timestamp}-${random}${ext}`);
    },
  }),
};
