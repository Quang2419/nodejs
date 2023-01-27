/**
 * @typedef { import('mongoose').ObjectId } ObjectId
 * 
 * @typedef { object } validate
 * @prop { ObjectId } order_id
 * @prop { ObjectId } cart_id
 * 
 * @typedef { object } buildQueryPaging
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
 */

/**
 * 
 * @param { validate } args
 * @returns 
 */

const Joi = require('joi')
const mongoose = require('mongoose')
const OrderItem = require('../models/order_item')
const Cart = require('../models/cart')

const validate = async(args) => {
    const schema = Joi.object({
        order_id: Joi.string().required(),
        cart_id: Joi.string().required()
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
        limit: Joi.number().min(1).integer().default(20).required(),
        page: Joi.number().min(1).integer().default(1).required(),
        start_date: Joi.date(),
        end_date: Joi.date(),
        _id: Joi.string(),
        product_id: Joi.string(),
    })
    return schema.validateAsync(args)
}

/**
 * 
 * @param { buildQueryPaging } args   
 * @returns 
 */
const buildQueryPaging = async(args) => {
    const { start_date: startDate =  '', end_date: endDate = '', _id: id = '', product_id: productId = '' } = args
    const query = {}
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
    if (id) { query._id = id }
    if ( productId ) { query.product_id = productId }
    return query
}

exports.getOrderItem = async(args) => {
    const { limit, page, ...rest } = await validatePaging(args)
    const query = await buildQueryPaging(rest)
    const getTotal = OrderItem.countDocuments(query)
    const getOrderItems = OrderItem.find(query)
        .limit(limit)
        .skip(limit * (page - 1))

    const [total, orderItems] = await Promise.all([getTotal, getOrderItems])
    const totalPage = Math.ceil(total / limit)
    return {
        total,
        page,
        limit,
        totalPage,
        orderItems
    }
};

/**
 * 
 * @param { validate } args 
 * @returns 
 */
exports.addOrderItem = async(args) => {
    const validateArgs = await validate(args)
    const {order_id: orderId, cart_id: cartId} = validateArgs
    const cart = await Cart.findOne({_id: cartId}).lean()
    if (!cart) throw new Error('cart_id is incorrect') 
    const {product_id: productId, price, quantity, total} = cart
    const query = {
        order_id: orderId,
        product_id: productId,
        price, quantity, total
    }
    const orderItem = OrderItem.findOne(query).lean()
    if (!orderItem) {
        return await OrderItem.create(query)
    }
    else throw new Error('order_item is already exists')
}