const authService = require('../services/authService');

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await authService.registerUser(email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await authService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
