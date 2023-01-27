/**
 * 
 * @typedef { object } findByCredentials
 * @prop { string } email
 * @prop { string } password
 * 
 * @typedef { object } generateToken
 * @prop { findByCredentials } findByCredentials
 * @prop { string } name
 * @prop { string } phone
 * @prop { array } roles
 * @prop { array } token 
 */

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Account = require('../models/account')
const Token = require('../models/token')

/**
 * @param { findByCredentials } param0
 * @return
 */
const findByCredentials = async({email, password}) => {
    const user = await Account.findOne({email}).lean()
    if (!user) throw new Error('Invalid login credentials')
    const isPasswordMath = await bcrypt.compare(password, user.password)
    if (!isPasswordMath) throw new Error('Invaild password')
    return user
}

/**
 * 
 * @param { generateToken } args
 * @return
 */
const generateToken = async(args) => {
    const {_id: id, roles } = args
    const token = jwt.sign(
        {
            _id: id,
            roles
        },
        process.env.TOKEN_KEY,
        )
    const query = {
        account_id: args._id,
        token: token
    }
    await Token.create(query)
    return token  
}

/**
 * 
 * @param { findByCredentials } param0
 */
exports.login = async({email, password}) => {
    if (!(email && password)) throw new Error('All input is required')
    const user =await findByCredentials({email, password})
    const token = await generateToken(user)
    return token
}
