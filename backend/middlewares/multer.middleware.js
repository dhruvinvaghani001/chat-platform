import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageForMessageFile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalExt = path.extname(file.originalname);
    const filenameWithoutExt = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    cb(null, filenameWithoutExt + "-" + uniqueSuffix + originalExt);
  },
});

const upload = multer({ storage: storage });
const uploadForMessageFile = multer({ storage: storageForMessageFile });

export { upload, uploadForMessageFile };
