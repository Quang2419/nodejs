const orderItemService = require('../services/order-item')

exports.getOrderItem = async(req, res) => {
    try {
      const args = Object.assign({}, req.query)
      const getOrderItem = await orderItemService.getOrderItem(args);
      res.json({ data: getOrderItem, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

exports.addOrderItem = async(req, res) => {
    try {
      const args = Object.assign({}, req.body)
      const addOrderItem = await orderItemService.addOrderItem(args);
      res.json({ data: addOrderItem, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
