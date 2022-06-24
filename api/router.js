const express = require("express");
const router = express.Router();

const authMiddleware = require("./middlewares/auth");
const adminMiddleware = require("./middlewares/admin");
const uploadMiddleware = require("./middlewares/upload");
const handler = require("./middlewares/handler");

const authModule = require("./auth");
router.post("/auth/register", handler(authModule.controller.register));
router.post("/auth/login", handler(authModule.controller.login));

const userModule = require("./user");
router.get("/users/me", authMiddleware, handler(userModule.controller.me));
router.post("/users/me", authMiddleware, handler(userModule.controller.updateMe));

const interestModule = require("./interest");
router.get("/interests", authMiddleware, handler(interestModule.controller.list));
router.get("/interests/:id", authMiddleware, handler(interestModule.controller.get));
router.post("/interests", authMiddleware, adminMiddleware, handler(interestModule.controller.create));
router.put("/interests/:id", authMiddleware, adminMiddleware, handler(interestModule.controller.update));
router.delete("/interests/:id", authMiddleware, adminMiddleware, handler(interestModule.controller.remove));
router.post("/interests/:id/cover", authMiddleware, adminMiddleware, uploadMiddleware.single("file"), handler(interestModule.controller.coverUpload));

const eventModule = require("./event");
router.get("/events", authMiddleware, handler(eventModule.controller.list));
router.get("/events/:id", authMiddleware, handler(eventModule.controller.get));
router.post("/events", authMiddleware, handler(eventModule.controller.create));
router.put("/events/:id", authMiddleware, handler(eventModule.controller.update));
router.delete("/events/:id", authMiddleware, handler(eventModule.controller.remove));
router.post("/events/:id/cover", authMiddleware, uploadMiddleware.single("file"), handler(eventModule.controller.coverUpload));

const postModule = require("./post");
router.get("/posts", authMiddleware, handler(postModule.controller.list));
router.get("/posts/:id", authMiddleware, handler(postModule.controller.get));
router.post("/posts", authMiddleware, handler(postModule.controller.create));
router.put("/posts/:id", authMiddleware, handler(postModule.controller.update));
router.delete("/posts/:id", authMiddleware, handler(postModule.controller.remove));
router.post("/posts/:id/image", authMiddleware, uploadMiddleware.single("file"), handler(postModule.controller.imageUpload));

module.exports = router;
