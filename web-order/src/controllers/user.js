const userService = require('../services/user')

exports.login = async(req, res) => {
    try {
      const {email, password} = Object.assign({}, req.body)
      const token = await userService.login({email, password});
      res.json({ data: token, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };