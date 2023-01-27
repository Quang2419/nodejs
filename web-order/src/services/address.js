/**
 * @typedef { import('mongoose').ObjectId } ObjectId
 * 
 * @typedef { Object } validate
 * @prop { ObjectId } user_id
 * @prop { string } name
 * @prop { string } email
 * @prop { string } phone
 * @prop { string } address
 * @prop { string } city
 * @prop { string } country
 * @prop { number } postal_code 
 * 
 * @typedef { object } validateUpdate
 * @prop { boolean } is_complete
 * @prop { validate } validate
 */

const Joi = require('joi')
const mongoose = require('mongoose')
const Address = require('../models/address')

/**
 * 
 * @param { validate } args
 * @returns 
 */
const validate = async(args) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        postal_code: Joi.number().integer().required(),
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
        user_id: Joi.string().required(),
        name: Joi.string(),
        email: Joi.string(),
        is_complete: Joi.boolean(),
        phone: Joi.string(),
        address: Joi.string(),
        city: Joi.string(),
        country: Joi.string(),
        postal_code: Joi.number().integer(),
    })
    return schema.validateAsync(args) 
}

/**
 * 
 * @param { validate } args
 * @returns 
 */
const buildQuery = async(args) => {
     const {user_id: userId, ...rest } = args
     return {
        account_id: userId,
        ...rest
     } 
}

/**
 * 
 * @param { string } userId 
 * @returns 
 */
exports.getAddress = async(userId) => {
    return await Address.find({account_id: userId}).lean()
};

/**
 * 
 * @param { validate } args
 * @returns 
 */
exports.addAddress = async(args) => {
    const validateArgs = await validate(args)
    const query = await buildQuery(validateArgs)
    const addresses = await Address.find({ account_id: query.account_id }).lean()
    if (addresses.length <= 7) { 
        await Address.create(query)
        return true
    }
    else throw new Error('addresss is max place')
}

/**
 * 
 * @param { validateUpdate } args
 * @returns 
 */
exports.updateAddress = async(args) => {
    if (!args._id) throw new Error('addressId is invalid')
    const {_id: id, ...rest} = args
    const validateArgs = await validateUpdate(rest)
    const {user_id: userId, ...query} = validateArgs
    const address = await Address.findOneAndUpdate({account_id: userId, _id: id}, {$set: query}).lean()
    if (!address) throw new Error(`no address_id ${id} in database address`)
    return true
};

/**
 * @param { object } args
 * @param { ObjectId } args.user_id
 * @param { ObjectId } args._id
 * @returns 
 */
exports.deleteAddress = async(args) => {
    if (!args._id) throw new Error('addressId is invalid')
    const {user_id: userId, _id: id} = args
    const address = await Address.findOne({_id: id, account_id: userId}).lean()
    if (address) {
        await Address.deleteOne({_id: id})
        return true
    }
    else throw new Error(`address is no addressId: ${id}`)
};
