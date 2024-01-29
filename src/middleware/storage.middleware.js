import multer from "multer";
import { v4 } from "uuid";

const storage = multer.diskStorage({
   
    filename: function (_, file, cb) {
        const uniqueSuffix = v4();
        const filename = file.fieldname + '-' + uniqueSuffix + file.originalname;
       
        cb(null, filename)
    }
})

export const uploadMiddleware = multer({ storage: storage }).single('file')