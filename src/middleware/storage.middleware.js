import multer from "multer";
import { v4 } from "uuid";

const storage = multer.diskStorage({
   
    filename: function (req, file, cb) {
        const uniqueSuffix = v4();
        const filename = file.fieldname + '-' + uniqueSuffix + file.originalname;
        req.meta = {
            name: filename,
            type: req.body?.type
        }
        cb(null, filename)
    }
})

export const uploadMiddleware = multer({ storage: storage }).single('file')