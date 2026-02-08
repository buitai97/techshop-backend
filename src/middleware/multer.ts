import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { v4 } from "uuid";
import s3 from "../config/s3.js";

const fileUploadMiddleware = (fieldName: string, dir: string) => {
    return multer({
        storage: multerS3({
            s3,
            bucket: process.env.S3_BUCKET_NAME || "tech-shop-images-bucket",
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                cb(null, `${dir}/${v4()}${ext}`);
            },
        }),
        limits: {
            fileSize: 1024 * 1024 * 3,
        },
        fileFilter: (
            req: Express.Request,
            file: Express.Multer.File,
            cb: Function,
        ) => {
            if (file.mimetype.startsWith("image/")) {
                cb(null, true);
            } else {
                cb(new Error("Only JPEG and PNG images are allowed."), false);
            }
        },
    }).single(fieldName);
};
export default fileUploadMiddleware;
