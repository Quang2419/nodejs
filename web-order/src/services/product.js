/**
 * 
 * @typedef { object } buildQueryPaging
 * @prop {date} start_date
 * @prop {date} end_date
 * 
 * @typedef { object } validatePaging
 * @prop { number } limit
 * @prop { number } page
 * @prop { buildQueryPaging } buildQueryPaging
 */

const Joi = require("joi");
const mongoose = require('mongoose')
const Product = require('../models/product')

/**
 * 
 * @param { validatePaging } args
 * @returns 
 */
const validatePaging = async (args) => {
    const schema = Joi.object({
        limit: Joi.number().min(1).integer().required(),
        page: Joi.number().min(1).integer().required(),
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
const buildQueryPaging = (args) => {
    const { start_date: startDate = '', end_date: endDate = '' } = args
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
    return query
}

/**
 * 
 * @param { validatePaging } args
 * @returns 
 */
exports.getProducts = async (args) => {
    const { limit, page, ...rest } = await validatePaging(args)
    const query = buildQueryPaging(rest)
    const getTotal = Product.countDocuments(query)
    const getProduct = Product.find(query)
        .limit(limit)
        .skip(limit * (page - 1))
    const [total, products] = await Promise.all([getTotal, getProduct])
    const totalPage = Math.ceil(total / limit)
    return {
        total,
        page,
        limit,
        totalPage,
        products
    }
};