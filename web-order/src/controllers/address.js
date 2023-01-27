
const addressService = require("../services/address");

exports.getAddress = async (req, res) => {
  try {
    const userId = req.user._id
    const address = await addressService.getAddress(userId);
    res.json({ data: address, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const args = Object.assign({}, { user_id: req.user._id }, req.body)
    const addAddress = await addressService.addAddress(args);
    res.json({ data: addAddress, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const args = Object.assign({}, { user_id: req.user._id }, {_id: req.params.id}, req.body)
    const updateAddress = await addressService.updateAddress(args);
    res.json({ data: updateAddress, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const args = Object.assign({}, {user_id: req.user._id}, {_id: req.params.id})
    await addressService.deleteAddress(args);
    res.json({ data: "true", status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};