import { prisma } from "../config/client";

const makePayment = async (
    orderId: number,
    cardNumber: string,
    expDate: string,
    CVV: string,
    paymentMethod: string
) => {
    // Simulate payment processing
    console.log(`Processing payment for order ${orderId} using ${paymentMethod}`);
    await prisma.payment.create({
        data: {
            orderId,
            cardNumber,
            expDate,
            CVV,
            paymentMethod,
            status: 'COMPLETED'
        }
    });
}

const createOrder = async (
    name: string,
    email: string,
    addressId: number,
    orderItems: { productId: number; quantity: number }[]
) => {
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        throw new Error("orderItems is required");
    }

    // Validate productIds (prevents undefined / strings / 0)
    const productIds = orderItems
        .map(i => Number(i.productId))
        .filter((id): id is number => Number.isInteger(id) && id > 0);

    if (productIds.length !== orderItems.length) {
        throw new Error("Invalid orderItems: each item must have a valid productId");
    }

    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true },
    });

    const priceById = new Map(products.map(p => [p.id, p.price]));

    const missing = productIds.filter(id => !priceById.has(id));
    if (missing.length) {
        throw new Error(`Products not found: ${missing.join(", ")}`);
    }

    const order = await prisma.order.create({
        data: {
            name,
            email,
            addressId,
            orderItems: {
                create: orderItems.map(i => ({
                    productId: Number(i.productId),
                    quantity: i.quantity,
                    price: priceById.get(Number(i.productId))!,
                })),
            },
        },
    });

    return order.id;
};


const createNewAddress = async (street: string, city: string, state: string, zipCode: string) => {
    const address = await prisma.address.upsert({
        where: {
            street_city_state_zipCode: {
                street,
                city,
                state,
                zipCode,
            },
        },
        update: {},
        create: {
            street,
            city,
            state,
            zipCode,
        },
    });
    return address.id;
}

export { createOrder, createNewAddress, makePayment }