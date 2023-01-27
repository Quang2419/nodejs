const orderService = require('../services/order')

exports.getOrder = async(req, res) => {
    try {
      const args = Object.assign({}, { user_id: req.user._id }, req.query)
      const getOrder = await orderService.getOrder(args);
      res.json({ data: getOrder, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

exports.addOrder = async(req, res) => {
    try {
      const args = Object.assign({}, { user_id: req.user._id }, req.body)
      const addOrder = await orderService.addOrder(args);
      res.json({ data: addOrder, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};


exports.updateOrder = async(req, res) => {
    try {
      const args = Object.assign({}, {_id: req.params.id}, req.body)
      const updateOrder = await orderService.updateOrder(args);
      res.json({ data: updateOrder, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
