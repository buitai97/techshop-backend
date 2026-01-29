import { prisma } from "../config/client";

const createOrder = async (name: string, email: string, addressId: number, items: any[], paymentMethod: string, expDate: string, CVV: string) => {
    

    return
}

const createAddress = async (street: string, city: string, state: string, zipCode: string) => {
    const res = await prisma.address.findFirst({
        where: { street, city, state, zipCode }
    });
    if (res) return res.id;
    const address = await prisma.address.create({ data: { street, city, state, zipCode } });
    return address.id;
}

export { createOrder, createAddress }