import { Request, Response } from "express";
import {
    addProduct,
    deleteProduct,
    getProductById,
    getProducts,
} from "../services/product.service";
import { prisma } from "../config/client";
import { deleteImageFromS3 } from "../services/s3.service";

const getProductsAPI = async (req: Request, res: Response) => {
    const { brands, targets, price, priceRange, inStockOnly, sort } = req.query;
    const page = Number((req.query.page as string | undefined) ?? "1");
    const pageSize = Number((req.query.pageSize as string | undefined) ?? "20");
    const products = await getProducts(
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
    const imageKey = req.file?.key ?? null;
    const productData = req.body;
    const newProduct = await addProduct(productData, imageKey);
    return res.status(200).json(newProduct);
};

const deleteProductAPI = async (req: Request, res: Response) => {
    const productId = +req.params.id;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    await deleteProduct(productId);
    if (product.imageKey) {
        await deleteImageFromS3(product.imageKey)
    }

    return res.status(200).json({ message: "Product deleted successfully" });
};

export { getProductsAPI, getProductByIdAPI, addProductAPI, deleteProductAPI };
