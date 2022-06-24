const postService = require("./post.service");
module.exports = {
  list: async (req, res) => {
    const result = await postService.list(req.query.interestId);
    res.json(result);
  },
  get: async (req, res) => {
    const result = await postService.findById(req.params.id);
    res.json(result);
  },
  create: async (req, res) => {
    const result = await postService.create(req.body, req.user);
    res.json(result);
  },
  update: async (req, res) => {
    await postService.checkPermission(req.params.id, req.user);
    const result = await postService.update(req.params.id, req.body);
    res.json(result);
  },
  remove: async (req, res) => {
    await postService.checkPermission(req.params.id, req.user);
    await postService.remove(req.params.id);
    res.send();
  },
  imageUpload: async (req, res) => {
    await postService.checkPermission(req.params.id, req.user);
    await postService.imageUpload(req.params.id, req.file.path);
    res.send();
  },
}