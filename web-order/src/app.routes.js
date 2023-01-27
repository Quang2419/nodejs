const express = require('express')
const auth = require('./middleware/auth')
const role = require('./middleware/role')
const router = express.Router()

router.get('/', (req, res) => res.send(`Hi Customer`))

//product
const productController = require('./controllers/product')
router.get('/products', productController.getProducts)

//cart
const cartController = require('./controllers/cart')
router.get('/carts', auth.verifyToken, cartController.getCarts)
router.post('/carts/:productId', auth.verifyToken, cartController.addCart)
router.put('/carts/:productId', auth.verifyToken, cartController.updateCart)
router.delete('/carts/:id', auth.verifyToken, cartController.deleteCart)

//address
const addressController = require('./controllers/address')
router.get('/address', auth.verifyToken, addressController.getAddress)
router.post('/address', auth.verifyToken, addressController.addAddress)
router.put('/address/:id', auth.verifyToken, addressController.updateAddress)
router.delete('/address/:id', auth.verifyToken, addressController.deleteAddress)

//user
const userController = require('./controllers/user')
router.get('/user/login', userController.login)

//order
const orderController = require('./controllers/order')
router.get('/order', auth.verifyToken, orderController.getOrder)
router.post('/order', auth.verifyToken, orderController.addOrder)
router.put('/order/:id', auth.verifyToken, orderController.updateOrder)

//order-item
const orderItemController = require('./controllers/order-item')
router.get('/order-item', auth.verifyToken, orderItemController.getOrderItem)
router.post('/order-item', auth.verifyToken, orderItemController.addOrderItem)

module.exports = router
