import { prisma } from "../config/client";
import { TOTAL_ITEMS_PER_PAGE } from "../config/constant";
import { retrievePaymentIntent } from "./stripe.service";

const makePayment = async (
  orderId: number,
  paymentDetails: {
    paymentIntentId: string;
    paymentMethod: string;
  },
) => {
  const paymentIntent = await retrievePaymentIntent(paymentDetails.paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
  }

  await prisma.payment.create({
    data: {
      orderId,
      stripePaymentIntentId: paymentDetails.paymentIntentId,
      paymentMethod: paymentDetails.paymentMethod,
      status: "COMPLETED",
    },
  });
};

const createOrder = async (
  name: string,
  email: string,
  addressId: number,
  totalPrice: number,
  userId: number,
  orderItems: { productId: number; quantity: number; price: number }[],
) => {
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        name,
        email,
        addressId,
        totalPrice,
        userId,
        orderItems: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { orderItems: true },
    });

    // Decrement stock for each ordered product
    await Promise.all(
      orderItems.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: { decrement: item.quantity },
            sold: { increment: item.quantity },
          },
        }),
      ),
    );

    return created;
  });

  return order.id;
};

const createNewAddress = async (
  street: string,
  city: string,
  state: string,
  zipCode: string,
) => {
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
};

const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id: +id },
    include: { user: true, orderItems: true },
  });
  return order;
};
const getOrdersByUserId = async (
  userId: number,
  page: number,
  pageSize: number,
) => {
  const skip = (page - 1) * pageSize;
  const orders = await prisma.order.findMany({
    where: { userId },
    take: pageSize,
    skip,
    include: { orderItems: true },
  });
  return orders;
};
const getOrders = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const orders = await prisma.order.findMany({
    take: pageSize,
    skip,
  });
  return orders;
};

export {
  getOrders,
  getOrderById,
  createOrder,
  createNewAddress,
  makePayment,
  getOrdersByUserId,
};
