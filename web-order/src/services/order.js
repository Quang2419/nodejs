/**
 * @typedef { import('mongoose').ObjectId } ObjectId
 * 
 * @typedef { object } validate
 * @prop { ObjectId } user_id
 * @prop { ObjectId } address_id
 * @prop { Array } cart_ids
 * 
 * @typedef { object } buildQueryPaging
 * @prop { string } user_id
 * @prop { date } start_date
 * @prop { date } end_date
 * @prop { ObjectId } order_item_id
 * @prop { ObjectId } address_id
 * @prop { string } status
 * @prop { string } code
 * 
 * @typedef { object } validatePaging
 * @prop { buildQueryPaging } buildQueryPaging
 * @prop { number } limit
 * @prop { number } page
 * 
 * @typedef { object } getOrderItemId
 * @prop { Array } cart_ids
 * @prop { ObjectId } order_id
 * 
 * @typedef { object } validateUpdate
 * @prop { ObjectId } _id
 * @prop { ObjectId } address_id
 * @prop { string } status
 */
const Joi = require('joi')
const mongoose = require('mongoose')
const Promise = require('bluebird')
const Order = require('../models/order')
const OrderItem = require('../models/order_item')
const Cart = require('../models/cart')
const orderItemService = require('./order-item')
const cartService = require('./cart')


/**
 * 
 * @param { validate } args
 * @returns 
 */
const validate = async(args) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        address_id: Joi.string().required(),
        cart_ids: Joi.array().required()
    })
    return schema.validateAsync(args) 
}

/**
 * 
 * @param { validateUpdate } args 
 * @returns 
 */
const validateUpdate = async(args) => {
    const schema = Joi.object({
        _id: Joi.string().required(),
        address_id: Joi.string(),
        status: Joi.string()
    })
    return schema.validateAsync(args) 
}

/**
 * 
 * @param { validatePaging } args
 * @returns 
 */
const validatePaging = async(args) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        limit: Joi.number().min(1).integer().default(20).required(),
        page: Joi.number().min(1).integer().default(1).required(),
        start_date: Joi.date(),
        end_date: Joi.date(),
        order_item_id: Joi.string(),
        address_id: Joi.string(),
        status: Joi.string(),
        code: Joi.boolean()

    })
    return schema.validateAsync(args)
}

/**
 * 
 * @param { buildQueryPaging } args   
 * @returns 
 */
const buildQueryPaging = async(args) => {
    const { user_id: userId, start_date: startDate =  '', end_date: endDate = '', order_item_id: orderItemId = '', address_id: addressId = '', status = '', code = '' } = args
    const query = { customer: userId }
    if (startDate) {
        if (endDate) {
            query.created_at = { $gte: startDate, $lte: endDate }
        } else {
            query.created_at = { $gte: startDate }
        }
    } else {
        if (endDate) {
            query.created_at = { $lte: endDate }
        }
    }
    if (orderItemId) { query.order_item_id = orderItemId }
    if ( addressId ) { query.address_id = addressId }
    if ( status ) { query.status = status }
    if ( code ) { query.code = code }
    return query
}

/**
 * 
 * @param { validate } args  
 * @returns 
 */
const buildQuery = async(args) => {
     const { user_id: userId, address_id: addressId } = args
     return {
        customer: userId,
        address_id: addressId,
        status: 'pending'
     } 
}

/**
 * 
 * @param { getOrderItemId } param0 
 * @returns 
 */
const getOrderItemId = async({cart_ids: cartIds, order_id: orderId}) => {
    const orderItemId = []
    let totalAll =  0
    await Promise.map(cartIds, async(cartId) => {
        const orderItem = await orderItemService.addOrderItem({cart_id: cartId, order_id: orderId})
        const {_id: id, price, quantity } = orderItem
        orderItemId.push(id)
        totalAll= totalAll + price * quantity
        // await cartService.deleteCart(cartId)
    }, {concurrency: 2})
    return { orderItemId, totalAll }
}

/**
 * 
 * @param { validatePaging } args
 * @returns 
 */
exports.getOrder = async(args) => {
    const { limit, page, ...rest } = await validatePaging(args)
    const query = await buildQueryPaging(rest)
    const getTotal = Order.countDocuments(query)
    const getOrders = Order.find(query)
        .limit(limit)
        .skip(limit * (page - 1))
        .populate({
            path: 'order_item_id',
            model: 'Order_item'
        })
        .populate({ 
            path: 'address_id',
            model: 'Address'
        })

    const [total, orders] = await Promise.all([getTotal, getOrders])
    const totalPage = Math.ceil(total / limit)
    return {
        total,
        page,
        limit,
        totalPage,
        orders
    }
};

/**
 * 
 * @param { validate } args 
 * @returns 
 */
exports.addOrder = async(args) => {
    const validateArgs = await validate(args)
    const { cart_ids: cartIds, ...rest } = validateArgs
    const query = await buildQuery(rest)
    const order = await Order.create(query)
    const  orderId = order.id
    const {orderItemId, totalAll} = await getOrderItemId({cart_ids: cartIds, order_id: orderId})
    await Order.updateOne({_id: orderId}, 
        { $set: {
            order_item_id: orderItemId,
            total_all: totalAll,
        }}
    )
    return true
}

/**
 * 
 * @param { validate } args  
 * @returns 
 */
exports.updateOrder = async(args) => {
    const validateArgs = await validateUpdate(args)
    const { _id: id, ...rest} = validateArgs
    const order = await Order.findOne({ _id: id }).lean()
    await Order.findOneAndUpdate({ _id: id}, {$set: {"update_at": Date.now(),...rest}})
    return true
}
