import { Prisma, Product } from "@prisma/client";
import { prisma } from "../config/client";


interface SearchProductsParams {
    page?: number;
    search?: string;
    limit?: number;
}

const searchProducts = async ({ page = 1, search = "", limit = 10 }: SearchProductsParams) => {
    const skip = (page - 1) * limit;
    const where = search ? {
        OR: [
            { name: { contains: search, mode: "insensitive" } },
            { brand: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
        ],
    }
        : {};

    const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
        }),
        prisma.product.count({ where }),
    ]);
    return {
        products,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    }
};

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
    search?: string,
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
    const addFilters: Prisma.ProductWhereInput[] = [];

    if (search?.trim()) {
        addFilters.push({
            OR: [
                { name: { contains: search } },
                { brand: { contains: search } },
                { category: { contains: search } },
            ],
        })
    };

    if (brands) {
        const brandsArray = Array.isArray(brands) ? brands : [brands];
        if (brandsArray.length) addFilters.push({ brand: { in: brandsArray } });
    }

    if (categories) {
        const categoryArray = Array.isArray(categories) ? categories : [categories];
        if (categoryArray.length) addFilters.push({ category: { in: categoryArray } });
    }

    if (priceRange && priceRange.length === 2) {
        const [gt, lt] = priceRange;
        const gte = Number(gt);
        const lte = Number(lt);
        if (Number.isFinite(gte) || Number.isFinite(lte)) {
            addFilters.push({
                price: {
                    ...(Number.isFinite(gte) ? { gte } : {}),
                    ...(Number.isFinite(lte) ? { lte } : {}),
                },
            });
        }
    }

    if (inStockOnly === "true") {
        addFilters.push({ quantity: { gte: 1 } });
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
            addFilters.push({ OR: priceCondition });
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
            where: addFilters.length ? { AND: addFilters } : undefined,
            orderBy,
            skip,
            take,
        }),
        prisma.product.count({ where: addFilters.length ? { AND: addFilters } : undefined }),
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
