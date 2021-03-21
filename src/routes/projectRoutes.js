const express = require("express");
const {
  getAll,
  create,
  getOne,
  update,
  remove,
} = require("../controllers/project");
const {
  getAllTasks,
  getOneTask,
  createTask,
  updateTask,
  removeTask,
} = require("../controllers/task");

const authenticateJWT = require("../utils/authMiddleware");
const router = express.Router();

router.get("/", authenticateJWT, getAll);
router.post("/", authenticateJWT, create);

router.get("/:id", authenticateJWT, getOne);
router.put("/:id", authenticateJWT, update);
router.delete("/:id", authenticateJWT, remove);

router.get("/:projectId/tasks", getAllTasks);
router.post("/:projectId/tasks", createTask);

router.get("/:projectId/tasks/:taskId", getOneTask);
router.put("/:projectId/tasks/:taskId", updateTask);
router.delete("/:projectId/tasks/:taskId", removeTask);

module.exports = router;
