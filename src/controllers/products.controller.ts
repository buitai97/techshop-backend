import { Request, Response } from "express";
import {
  addProduct,
  deleteProduct,
  getProductById,
    getProducts,
} from "../services/product.service";
import { prisma } from "../config/client";
import { deleteImagesFromS3 } from "../services/s3.service";

const getProductsAPI = async (req: Request, res: Response) => {
    const { brands, targets, price, priceRange, inStockOnly, sort, searchTerm } = req.query;
    const page = Number((req.query.page as string | undefined) ?? 1);
    const pageSize = Number((req.query.pageSize as string | undefined) ?? 20);
    const products = await getProducts(
        searchTerm as string,
        page,
        pageSize,
        brands as string[],
        targets as string[],
        price as string,
        priceRange as string[],
        inStockOnly as string,
        sort as string,
    );
    return res.status(200).json(products);
};

const getProductByIdAPI = async (req: Request, res: Response) => {
    const product = await getProductById(+req.params.id);
    return res.status(200).json(product);
};

const addProductAPI = async (req: Request, res: Response) => {
    try {
        const files = (req.files as Express.MulterS3.File[] | undefined) ?? [];
        const imageKeys = files.map((file) => file.key);
        const productData = req.body;
        const newProduct = await addProduct(productData, imageKeys);
        return res.status(200).json(newProduct);
    } catch (error) {
        console.error("Failed to create product:", error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Failed to create product",
        });
    }
};

const deleteProductAPI = async (req: Request, res: Response) => {
    const productId = +req.params.id;
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { productImages: true },
    });
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    const imageKeys = [
        product.imageKey,
        ...product.productImages.map((image) => image.imageKey),
    ].filter((imageKey): imageKey is string => Boolean(imageKey));

    await deleteProduct(productId);
    if (imageKeys.length > 0) {
        await deleteImagesFromS3(imageKeys)
    }

    return res.status(200).json({ message: "Product deleted successfully" });
};

export { getProductsAPI, getProductByIdAPI, addProductAPI, deleteProductAPI };
