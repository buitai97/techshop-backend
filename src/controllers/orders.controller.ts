import { createAddress, createOrder } from "../services/orders.service";

const createOrderAPI = async (req, res) => {
    // Implementation for creating an order
    const { name, email, street, city, state, zipCode, items, paymentMethod, expDate, CVV } = req.body;
    const addressId = await createAddress(street, city, state, zipCode);
    await createOrder(name, email, +addressId, items, paymentMethod, expDate, CVV);

}

export { createOrderAPI }