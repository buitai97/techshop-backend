import { createNewAddress, createOrder, makePayment } from "../services/orders.service";
import { Request, Response } from "express"

const createOrderAPI = async (req: Request, res: Response) => {
    const { name, address, email, totalPrice, orderItems, paymentDetails } = req.body;
    const addressId = await createNewAddress(address.street, address.city, address.state, address.zipCode);
    const orderId = await createOrder(
        name,
        email,
        addressId,
        totalPrice,
        orderItems,
    );
    await makePayment(orderId, paymentDetails);
    res.status(201).json({ message: "Order created and payment processed successfully", orderId });
}

export { createOrderAPI }