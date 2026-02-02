import { createNewAddress, createOrder } from "../services/orders.service";
import { Request, Response } from "express"

const createOrderAPI = async (req: Request, res: Response) => {
    // Implementation for creating an order
    console.log("Creating order with data:", req.body);
    const { name, address, email, cartItems, cardNumber, CVV, expDate, paymentMethod } = req.body;
    const newAddress = await createNewAddress(address.street, address.city, address.state, address.zipCode);
    await createOrder(
        name,
        email,
        newAddress,
        cartItems,
        { cardNumber, expDate, CVV, paymentMethod }
    );

}

export { createOrderAPI }