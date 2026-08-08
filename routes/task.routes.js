const express = require("express");

const router = express.Router();

const taskController = require("../controllers/task.controller");

const authMiddleware = require("../middleware/verifyToken");

router.post("/", authMiddleware, taskController.createTask);

router.get("/", authMiddleware, taskController.getAllTasks);

router.get("/:id", authMiddleware, taskController.getTask);

router.put("/:id", authMiddleware, taskController.updateTask);

router.delete("/:id", authMiddleware, taskController.deleteTask);

// router.get( "/admin/tasks", auth, isTeacher, taskController.getAllStudentTasks);
router.get( "/admin/tasks", taskController.getAllStudentTasks);


module.exports = router;