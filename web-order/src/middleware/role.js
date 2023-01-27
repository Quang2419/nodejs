exports.currentUserHasRole = role => (req, res, next) => {
    if (!role) {
        return res.status(403).json('role is empty')
    }

    const userRoles = req.user.roles
    if (!Array.isArray(userRoles) || userRoles.length === 0) {
        return res.status(403)
    }
    if (userRoles.indexOf(role) === -1) {
        return res.send({
            success: false,
            message: 'You do not have permission to access this resource.'
        })
    }
    
    return next
}