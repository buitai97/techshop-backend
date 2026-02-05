import express, { Express } from 'express'
import { fetchAccountAPI, getUsersAPI, loginAPI, registerAPI } from '../controllers/users.controller'
import { addProductAPI, deleteProductAPI, getProductByIdAPI, getProductsAPI } from '../controllers/products.controller'
import { checkValidJWT } from '../middleware/jwt.middleware'
import { postDeleteUser } from '../controllers/users.controller'
import { addToCartAPI, emptyCartAPI, getCartAPI, getUserCartSumAPI, updateCartAPI } from '../controllers/carts.controller'
import { createOrderAPI } from '../controllers/orders.controller'
import fileUploadMiddleware from '../middleware/multer'

const router = express.Router()

const apiRoutes = (app: Express) => {

    // users
    router.get("/users", getUsersAPI)
    router.delete("/users/:id", postDeleteUser)

    //auth
    router.post("/register", registerAPI)
    router.post("/login", loginAPI)
    router.get("/account", fetchAccountAPI)

    //products
    router.post("/products", fileUploadMiddleware("image", "images/product"), addProductAPI)
    router.get("/products", getProductsAPI)
    router.get("/products/:id", getProductByIdAPI)
    router.delete("/products/:id", deleteProductAPI)

    // carts
    router.get("/cart", getCartAPI)
    router.get("/cartCount", getUserCartSumAPI)
    router.post("/cart", addToCartAPI)
    router.put("/cart", updateCartAPI)
    router.post("/cart/empty", emptyCartAPI)

    // // orders
    // router.get("/orders", getOrdersAPI)
    // router.get("/orders/:id", getOrderByIdAPI)
    router.post("/orders", createOrderAPI)
    // router.put("/orders/:id", updateOrderAPI)
    // router.delete("/orders/:id", deleteOrderAPI)


    app.use("/api", checkValidJWT, router)
}



export default apiRoutes