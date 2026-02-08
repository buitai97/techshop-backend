import { Product } from "@prisma/client";
import { prisma } from "../config/client";

const addProduct = async (productData: Product, imagePath: string | null) => {
    const newProduct = await prisma.product.create({
        data: {
            detailDesc: productData.detailDesc,
            brand: productData.brand,
            name: productData.name,
            price: +productData.price,
            quantity: +productData.quantity,
            shortDesc: productData.shortDesc,
            category: productData.category,
            imageKey: imagePath,
        },
    });

    return newProduct;
};

const updateProduct = async (id: number, productData: Product) => {
    await prisma.product.update({
        where: { id: id },
        data: {
            detailDesc: productData.detailDesc,
            brand: productData.brand,
            name: productData.name,
            price: +productData.price,
            quantity: +productData.quantity,
            shortDesc: productData.shortDesc,
            category: productData.category,
            imageKey: productData.imageKey,
        },
    });
};

const deleteProduct = async (id: number) => {
    await prisma.product.delete({
        where: { id: id },
    });
};

const getProducts = async (
    page?: number,
    pageSize?: number,
    brands?: string | string[],
    categories?: string | string[],
    price?: string,
    priceRange?: string[],
    inStockOnly?: string,
    sort?: string,
) => {
    // ---- pagination: coerce + defaults ----
    const pageNum =
        Number.isFinite(page as number) && (page as number) > 0
            ? Math.floor(page as number)
            : 1;
    const pageSizeNum =
        Number.isFinite(pageSize as number) && (pageSize as number) > 0
            ? Math.floor(pageSize as number)
            : 20;
    const skip = (pageNum - 1) * pageSizeNum;
    const take = pageSizeNum;

    // ---- filters ----
    const whereClause: any = {};

    if (brands) {
        const brandsArray = Array.isArray(brands) ? brands : [brands];
        if (brandsArray.length) whereClause.brand = { in: brandsArray };
    }

    if (categories) {
        const categoryArray = Array.isArray(categories) ? categories : [categories];
        if (categoryArray.length) whereClause.category = { in: categoryArray };
    }

    if (priceRange && priceRange.length === 2) {
        const [gt, lt] = priceRange;
        const gte = Number(gt);
        const lte = Number(lt);
        if (Number.isFinite(gte) || Number.isFinite(lte)) {
            whereClause.price = {
                ...(Number.isFinite(gte) ? { gte } : {}),
                ...(Number.isFinite(lte) ? { lte } : {}),
            };
        }
    }

    if (inStockOnly === "true") {
        whereClause.quantity = { gte: 1 };
    }

    if (price) {
        const priceInput = price.split(",");
        const priceCondition: any[] = [];

        for (const token of priceInput) {
            if (token === "under-1000") priceCondition.push({ price: { lt: 1000 } });
            if (token === "1000-1500")
                priceCondition.push({ price: { gte: 1000, lte: 1500 } });
            if (token === "1500-to-2000")
                priceCondition.push({ price: { gte: 1500, lt: 2000 } });
            if (token === "over-2000") priceCondition.push({ price: { gte: 2000 } });
        }

        if (priceCondition.length) {
            whereClause.OR = priceCondition;
        }
    }

    // ---- sort ----
    const orderBy =
        sort === "desc"
            ? { price: "desc" as const }
            : sort === "asc"
                ? { price: "asc" as const }
                : { id: "desc" as const };

    // ---- query ----
    const [products, count] = await prisma.$transaction([
        prisma.product.findMany({
            where: whereClause,
            orderBy,
            skip,
            take,
        }),
        prisma.product.count({ where: whereClause }),
    ]);

    const totalPages = Math.max(1, Math.ceil(count / pageSizeNum));

    return { products, totalPages, count };
};

const countTotalProductClientPages = async (pageSize: number) => {
    const totalItems = await prisma.product.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    return totalPages;
};

const getProductById = async (id: number) => {
    const product = await prisma.product.findUnique({
        where: {
            id: id,
        },
    });
    return product;
};

export {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    getProductById,
    countTotalProductClientPages,
};
