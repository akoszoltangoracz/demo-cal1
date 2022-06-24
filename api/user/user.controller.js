const userService = require('./user.service');

module.exports = {
  me: async (req, res) => {
    res.json({
      ...req.user,
      password: undefined,
    });
  },

  updateMe: async (req, res) => {
    await userService.update(req.user._id, req.body);
    const updated = await userService.findById(req.user._id);

    res.json({
      ...updated,
      password: undefined,
    })
  },

  list: async (req, res) => {
    const users = await userService.list();

    const masked = users.map(u => ({
      ...u,
      password: undefined,
    }));

    res.json(masked);
  },
}
