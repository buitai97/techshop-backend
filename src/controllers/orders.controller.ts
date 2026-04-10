import {
  createNewAddress,
  createOrder,
  getOrders,
  getOrdersByUserId,
  makePayment,
} from "../services/orders.service";
import { emptyCart } from "../services/carts.service";
import { Request, Response } from "express";

const createOrderAPI = async (req: Request, res: Response) => {
  const { name, address, email, totalPrice, orderItems, paymentDetails } =
    req.body;
  const userId = req.user!.id;

  try {
    const addressId = await createNewAddress(
      address.street,
      address.city,
      address.state,
      address.zipCode,
    );
    const orderId = await createOrder(
      name,
      email,
      addressId,
      totalPrice,
      userId,
      orderItems,
    );
    await makePayment(orderId, paymentDetails);
    await emptyCart(userId);
    res.status(201).json({
      message: "Order created and payment processed successfully",
      orderId,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to process order", error: err });
  }
};

const getOrdersAPI = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const orders = await getOrders(1, 10);
  res.status(200).json(orders);
};

const getOrdersByUserAPI = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const orders = await getOrdersByUserId(userId, 1, 10);
  res.status(200).json(orders);
};
export { createOrderAPI, getOrdersAPI, getOrdersByUserAPI };
