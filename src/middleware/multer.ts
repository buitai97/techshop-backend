import multer from "multer";
import multerS3 from "multer-s3";
import { NextFunction, Request, Response } from "express";
import path from "path";
import { v4 } from "uuid";
import s3 from "../config/s3.js";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

const fileUploadMiddleware = (fieldName: string, dir: string) => {
    const uploader = multer({
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
            fileSize: MAX_IMAGE_SIZE_BYTES,
        },
        fileFilter: (
            req: Express.Request,
            file: Express.Multer.File,
            cb: Function,
        ) => {
            if (file.mimetype.startsWith("image/")) {
                cb(null, true);
            } else {
                cb(new Error("Only JPEG, JPG and PNG images are allowed."), false);
            }
        },
    }).array(fieldName, 8);

    return (req: Request, res: Response, next: NextFunction) => {
        uploader(req, res, (error) => {
            if (!error) {
                return next();
            }

            console.error("Product upload failed:", error);
            if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    message: `Each image must be 10 MB or smaller.`,
                });
            }

            return res.status(500).json({
                message: error instanceof Error ? error.message : "Product upload failed",
            });
        });
    };
};
export default fileUploadMiddleware;
