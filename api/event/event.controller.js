const eventService = require("./event.service");
module.exports = {
  list: async (req, res) => {
    const result = await eventService.list(req.query.interestId);
    res.json(result);
  },
  get: async (req, res) => {
    const result = await eventService.findById(req.params.id);
    res.json(result);
  },
  create: async (req, res) => {
    const result = await eventService.create(req.body, req.user);
    res.json(result);
  },
  update: async (req, res) => {
    await eventService.checkPermission(req.params.id, req.user);
    const result = await eventService.update(req.params.id, req.body);
    res.json(result);
  },
  remove: async (req, res) => {
    await eventService.checkPermission(req.params.id, req.user);
    await eventService.remove(req.params.id);
    res.send();
  },
  coverUpload: async (req, res) => {
    await eventService.checkPermission(req.params.id, req.user);
    await eventService.coverUpload(req.params.id, req.file.path);
    res.send();
  },
  toggleAttend: async (req, res) => {
    const result = await eventService.toggleAttend(req.params.id, req.user);
    res.json(result);
  }
}