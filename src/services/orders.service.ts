import { prisma } from "../config/client";

const createOrder = async (
    name: string,
    email: string,
    address: { street: string, city: string, state: string, zipCode: string },
    orderDetails: { productId: number, quantity: number }[],
    paymentDetails: { cardNumber: string, expDate: string, CVV: string, paymentMethod: string }) => {


    return
}

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
    return address;
}

export { createOrder, createNewAddress }