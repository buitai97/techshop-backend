import { createNewAddress, createOrder, makePayment } from "../services/orders.service";
import { Request, Response } from "express"

const createOrderAPI = async (req: Request, res: Response) => {
    // Implementation for creating an order
    console.log("Creating order with data:", req.body);
    const { name, address, email, orderItems, cardNumber, CVV, expDate, paymentMethod } = req.body;
    const addressId = await createNewAddress(address.street, address.city, address.state, address.zipCode);
    const orderId = await createOrder(
        name,
        email,
        addressId,
        orderItems,
    );
    await makePayment(orderId, cardNumber, expDate, CVV, paymentMethod);

}

export { createOrderAPI }