import { prisma } from "../config/client"

const getCartById = async (id: number) => {
    const cart = await prisma.cart.findUnique({
        where: { userId: id },
        include: { cartItems: { include: { product: true }, omit: { cartId: true, productId: true } } },
    })
    return cart

}

const getUserCartSum = async (id: string) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId: +id
        },
        include: { cartItems: true }
    })
    const sum = cart?.cartItems.reduce((acc, item) => acc + item.quantity, 0)
    return sum ?? 0
}

const addToCart = async (userId: number, productId: number, quantity: number) => {
    let cart = await prisma.cart.findUnique({
        where: {
            userId
        }
    })

    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId,
                cartItems: {
                    create: {
                        productId,
                        quantity,
                    }
                }
            }
        })
    } else {
        const cartItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId
                }
            }
        })

        if (cartItem) {
            cartItem.quantity += quantity
            await prisma.cartItem.update({
                where: {
                    id: cartItem.id
                },
                data: {
                    quantity: cartItem.quantity
                }
            })
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity
                }
            })
        }
    }

    return cart
}

const updateCart = async (cartItemId: number, quantity: number) => {
    if (quantity === 0) {
        await prisma.cartItem.delete({
            where: { id: cartItemId }
        })
    }
    else {
        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity }
        })
    }
}
// This function is used when user want to update the quantity of a cart item. If the quantity is updated to 0, the cart item will be deleted.
const deleteCartItem = async (cartItemId: number) => {
    await prisma.cartItem.delete({
        where: { id: cartItemId }
    })
}

const emptyCart = async (userId: number) => {
    const cart = await prisma.cart.findUnique({
        where: { userId }
    })
    if (cart) {
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        })
    }
}

export { getCartById, getUserCartSum, addToCart, updateCart, deleteCartItem, emptyCart }