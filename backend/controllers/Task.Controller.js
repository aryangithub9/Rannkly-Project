import Task from '../models/Task.js';
import User from '../models/User.js';

// @desc    Get all tasks (based on role)
// @route   GET /api/v1/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    let query;

    // Role-based filtering
    if (req.user.role === 'Employee') {
      // Employee: Only see tasks assigned to them or created by them
      query = {
        $or: [
          { assignedTo: req.user.id },
          { createdBy: req.user.id }
        ]
      };
    } else if (req.user.role === 'Manager' || req.user.role === 'Admin') {
      // Manager and Admin: See all tasks
      query = {};
    }

    // Optional filters from query params
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.priority) {
      query.priority = req.query.priority;
    }
    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: { tasks }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role');

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    // Check permission
    if (req.user.role === 'Employee') {
      if (
        task.assignedTo._id.toString() !== req.user.id &&
        task.createdBy._id.toString() !== req.user.id
      ) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to access this task'
        });
      }
    }

    res.status(200).json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    // Check if assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'Assigned user not found'
      });
    }

    // Check role-based permissions for assignment
    if (req.user.role === 'Manager') {
      // Manager can only assign to Employees
      if (assignedUser.role !== 'Employee') {
        return res.status(403).json({
          status: 'error',
          message: 'Managers can only assign tasks to Employees'
        });
      }
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user.id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role');

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: { task: populatedTask }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    // Check permissions based on role
    if (req.user.role === 'Employee') {
      // Employee can only update tasks they created
      if (task.createdBy.toString() !== req.user.id) {
        // Or update status/priority if assigned to them
        if (task.assignedTo.toString() === req.user.id) {
          // Only allow status and priority updates
          const allowedFields = ['status', 'priority'];
          const updateFields = Object.keys(req.body);
          const isValidOperation = updateFields.every(field => 
            allowedFields.includes(field)
          );

          if (!isValidOperation) {
            return res.status(403).json({
              status: 'error',
              message: 'You can only update status and priority for assigned tasks'
            });
          }
        } else {
          return res.status(403).json({
            status: 'error',
            message: 'Not authorized to update this task'
          });
        }
      }
    }

    // If assignedTo is being updated, check if user exists
    if (req.body.assignedTo) {
      const assignedUser = await User.findById(req.body.assignedTo);
      if (!assignedUser) {
        return res.status(404).json({
          status: 'error',
          message: 'Assigned user not found'
        });
      }

      // Manager can only assign to Employees
      if (req.user.role === 'Manager' && assignedUser.role !== 'Employee') {
        return res.status(403).json({
          status: 'error',
          message: 'Managers can only assign tasks to Employees'
        });
      }
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role');

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    // Check permissions based on role
    if (req.user.role === 'Employee') {
      // Employee can only delete tasks they created
      if (task.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to delete this task'
        });
      }
    }

    await task.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks statistics
// @route   GET /api/v1/tasks/stats
// @access  Private
export const getTaskStats = async (req, res, next) => {
  try {
    let matchQuery = {};

    // Role-based filtering
    if (req.user.role === 'Employee') {
      matchQuery = {
        $or: [
          { assignedTo: req.user._id },
          { createdBy: req.user._id }
        ]
      };
    }

    const stats = await Task.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Task.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        statusStats: stats,
        priorityStats: priorityStats
      }
    });
  } catch (error) {
    next(error);
  }
};