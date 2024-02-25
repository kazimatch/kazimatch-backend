import multer from "multer";
import { v4 } from "uuid";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (_, file, cb) {
        const uniqueSuffix = v4();
        const filename = file.fieldname + '-' + uniqueSuffix + file.originalname;

        cb(null, filename)
    }
})

export const uploadMiddleware = multer({ storage: storage }).single('file')