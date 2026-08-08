const Task = require("../models/task.model");
const taskValidation = require("../validators/task.validator");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { error } = taskValidation(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const task = new Task({
      ...req.body,
   student: req.user.id
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: "Task Created Successfully",
      task,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllStudentTasks = async (req, res) => {

    try {

        const tasks = await Task.find()
            .populate("student", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            tasks
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Get All Tasks
exports.getAllTasks = async (req, res) => {
  try {

    const tasks = await Task.find({
      student: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(tasks);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

// Get Single Task
exports.getTask = async (req, res) => {

  try {

    const task = await Task.findOne({
       _id: req.params.id,
      student: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }

    res.json(task);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

// Update Task
exports.updateTask = async (req, res) => {

  try {

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        student: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }

    res.json({
      success: true,
      message: "Task Updated",
      task,
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// Delete Task
exports.deleteTask = async (req, res) => {

  try {

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      student: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }

    res.json({
      success: true,
      message: "Task Deleted Successfully",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};