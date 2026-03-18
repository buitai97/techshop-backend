import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3";

const deleteImageFromS3 = async (imageKey: string) => {
    try {
        await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME!,
                Key: imageKey,
            })
        );
    } catch (error) {
        console.error("Failed to delete image from S3:", imageKey, error);
        // DO NOT throw — DB deletion already happened
    }
}

const deleteImagesFromS3 = async (imageKeys: string[]) => {
    await Promise.all(imageKeys.map((imageKey) => deleteImageFromS3(imageKey)));
};

export { deleteImageFromS3, deleteImagesFromS3 };
