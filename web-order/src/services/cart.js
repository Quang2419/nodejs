/**
 * @typedef { import('mongoose').ObjectId } ObjectId
 * 
 * @typedef { object } deleteCart
 * @prop { ObjectId } user_id
 * @prop { ObjectId } product_id
 * 
 * @typedef { object } validate
 * @prop { deleteCart } deleteCart
 * @prop { number } quantity
 * 
 * @typedef { object } buildQueryPaging
 * @prop { string } user_id
 * @prop { date } start_date
 * @prop { date } end_date
 * 
 * @typedef { object } validatePaging
 * @prop { buildQueryPaging } buildQueryPaging
 * @prop { number } limit
 * @prop { number } page
 */
const Joi = require('joi')
const mongoose = require('mongoose')
const Cart = require('../models/cart')
const Product = require('../models/product')

/**
 * 
 * @param { validate } args
 * @returns 
 */
const validate = async(args) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        product_id: Joi.string().required(),
        quantity: Joi.number().min(1).integer().required()
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
        end_date: Joi.date()
    })
    return schema.validateAsync(args)
}

/**
 * 
 * @param { buildQueryPaging } args   
 * @returns 
 */
const buildQueryPaging = async(args) => {
    const { user_id: userId, start_date: startDate =  '', end_date: endDate = '' } = args
    const query = { account_id: userId }
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
    return query
}

/**
 * 
 * @param { validate } args  
 * @returns 
 */
const buildQuery = async(args) => {
     const { product_id: productId, quantity, user_id: userId } = args
     const product = await Product.findOne({_id: productId}).lean()
     if (!product) throw new Error('product is no exist')
     return {
        product_id: productId,
        quantity,
        price: product.price,
        total: product.price * quantity,
        account_id: userId
     } 
}

/**
 * 
 * @param { validatePaging } args
 * @returns 
 */
exports.getCarts = async(args) => {
    const { limit, page, ...rest } = await validatePaging(args)
    const query = await buildQueryPaging(rest)
    const getTotal = Cart.countDocuments(query)
    const getCart = Cart.find(query)
        .limit(limit)
        .skip(limit * (page - 1))

    const [total, carts] = await Promise.all([getTotal, getCart])
    const totalPage = Math.ceil(total / limit)
    return {
        total,
        page,
        limit,
        totalPage,
        carts
    }
};

/**
 * 
 * @param { validate } args 
 * @returns 
 */
exports.addCart = async(args) => {
    const validateArgs = await validate(args)
    const query = await buildQuery(validateArgs)
    const {product_id: productId, account_id: accountId, quantity} = query
    const cart = await Cart.findOne({product_id: productId, account_id: accountId}).lean()
    if (!cart) { 
        await Cart.create(query)
        return true
    }
    else {
        query.quantity = quantity + cart.quantity
        query.total = query.quantity * query.price
        await Cart.updateOne({product_id: productId, account_id: accountId}, {$set: query})
        return true
    }
}

/**
 * 
 * @param { validate } args  
 * @returns 
 */
exports.updateCart = async(args) => {
    const validateArgs = await validate(args)
    const query = await buildQuery(validateArgs)
    const {product_id: productId, ...rest} = query
    const cart = await Cart.findOne({ product_id: productId, quantity: query.quantity}).lean()
    if (cart) {
        await Cart.findOneAndUpdate({product_id: productId}, {$set: rest}).lean()
        return true
    }
    else {
        await Cart.create(query)
        return true
    }
    
};

/**
 * @param { ObjectId } id 
 * @returns 
 */
exports.deleteCart = async(id) => {
    const cart = await Cart.findOne({_id: id}).lean()
    if (cart) {
        await Cart.deleteOne({_id: id})
        return true
    }
    else throw new Error(`carts is no productId: ${productId}`)
};
