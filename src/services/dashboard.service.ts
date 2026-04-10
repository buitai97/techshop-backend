import { prisma } from "../config/client"

const getDashboardInfo = async () => {
    const userCount = await prisma.user.count()
    const orderCount = await prisma.order.count()
    const productCount = await prisma.product.count()

    return { userCount, orderCount, productCount }
}

export { getDashboardInfo }