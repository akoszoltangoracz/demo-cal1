const interestService = require("./interest.service");
module.exports = {
  list: async (req, res) => {
    const result = await interestService.list();
    res.json(result);
  },
  get: async (req, res) => {
    const result = await interestService.findById(req.params.id);
    res.json(result);
  },
  create: async (req, res) => {
    const result = await interestService.create(req.body, req.user);
    res.json(result);
  },
  update: async (req, res) => {
    const result = await interestService.update(req.params.id, req.body);
    res.json(result);
  },
  remove: async (req, res) => {
    await interestService.remove(req.params.id);
    res.send();
  },
  coverUpload: async (req, res) => {
    await interestService.coverUpload(req.params.id, req.file.path);
    res.send();
  },
}