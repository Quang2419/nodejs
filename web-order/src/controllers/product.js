const productService = require("../services/product");
 
 exports.getProducts = async (req, res) => {
  try {
    const  args = Object.assign({}, req.query)
    const products = await productService.getProducts(args);
    res.json({ data: products, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};