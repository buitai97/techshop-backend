import { prisma } from "../config/client";
import { TOTAL_ITEMS_PER_PAGE } from "../config/constant";

const makePayment = async (
  orderId: number,
  paymentDetails: {
    cardNumber: string;
    expDate: string;
    CVV: string;
    paymentMethod: string;
  },
) => {
  // Simulate payment processing
  await prisma.payment.create({
    data: {
      orderId,
      cardNumber: paymentDetails.cardNumber,
      expDate: paymentDetails.expDate,
      CVV: paymentDetails.CVV,
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
  const order = await prisma.order.create({
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
