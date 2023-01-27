const cartService = require("../services/cart");

exports.getCarts = async (req, res) => {
  try {
    const userId = req.user._id
    const args = Object.assign({}, { user_id: userId }, req.query)
    const carts = await cartService.getCarts(args);
    res.json({ data: carts, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addCart = async (req, res) => {
  try {
    const { productId } = req.params
    const userId = req.user._id
    const args = Object.assign({}, { product_id: productId }, { user_id: userId }, req.body)
    const addCart = await cartService.addCart(args);
    res.json({ data: addCart, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const userId = req.user._id
    const { productId } = req.params
    const args = Object.assign({}, { product_id: productId }, { user_id: userId }, req.body)
    const updateCart = await cartService.updateCart(args);
    res.json({ data: updateCart, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { id } = req.params
    await cartService.deleteCart(id);
    res.json({ data: "true", status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};