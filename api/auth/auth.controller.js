const authService = require("./auth.service");
module.exports = {
  register: async (req, res) => {
    await authService.register(req.body);
    res.send();
  },
  login: async (req, res) => {
    const result = await authService.login(req.body);
    res.json(result);
  }
}