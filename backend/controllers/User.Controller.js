import User from '../models/User.js';
import Task from '../models/Task.js';

// @desc    Get all users (based on role)
// @route   GET /api/v1/users
// @access  Private (Manager, Admin)
export const getUsers = async (req, res, next) => {
  try {
    let query = {};

    // Manager can only view Employees
    if (req.user.role === 'Manager') {
      query.role = 'Employee';
    }

    const users = await User.find(query).select('-password');

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Employee can only view their own profile
    if (req.user.role === 'Employee' && req.params.id !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this user'
      });
    }

    // Manager can only view Employees
    if (req.user.role === 'Manager' && user.role !== 'Employee') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this user'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Only Admin or Manager can change role
    if (req.body.role && req.user.role !== 'Admin' && req.user.role !== 'Manager') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to change user role'
      });
    }

    // Employee can only update their own profile (name, email only)
    if (req.user.role === 'Employee') {
      if (req.params.id !== req.user.id) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to update this user'
        });
      }
      // Restrict fields Employee can update
      const allowedFields = ['name', 'email'];
      const updateFields = Object.keys(req.body);
      const isValidOperation = updateFields.every(field => 
        allowedFields.includes(field)
      );

      if (!isValidOperation) {
        return res.status(403).json({
          status: 'error',
          message: 'You can only update your name and email'
        });
      }
    }

    // Manager can only update Employees (but can now assign any role)
    if (req.user.role === 'Manager') {
      if (user.role !== 'Employee') {
        return res.status(403).json({
          status: 'error',
          message: 'Managers can only update Employee profiles'
        });
      }
      // Removed: restriction on setting role only to Employee
    }

    // Don't allow password updates through this route
    if (req.body.password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please use the change password route to update password'
      });
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if user has assigned tasks
    const assignedTasks = await Task.countDocuments({ assignedTo: req.params.id });
    if (assignedTasks > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot delete user. User has ${assignedTasks} assigned task(s). Please reassign or delete tasks first.`
      });
    }

    // Check if user has created tasks
    const createdTasks = await Task.countDocuments({ createdBy: req.params.id });
    if (createdTasks > 0) {
        return res.status(400).json({
            status: 'error',
            message: `Cannot delete user. User has created ${createdTasks} task(s). Please reassign or delete tasks first.`
        });
    }

    await user.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/v1/users/stats
// @access  Private (Manager, Admin)
export const getUserStats = async (req, res, next) => {
  try {
    let matchQuery = {};

    // Manager can only see Employee stats
    if (req.user.role === 'Manager') {
      matchQuery.role = 'Employee';
    }

    const stats = await User.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const activeUsers = await User.countDocuments({ 
      ...matchQuery, 
      isActive: true 
    });

    const inactiveUsers = await User.countDocuments({ 
      ...matchQuery, 
      isActive: false 
    });

    res.status(200).json({
      status: 'success',
      data: {
        roleStats: stats,
        activeUsers,
        inactiveUsers
      }
    });
  } catch (error) {
    next(error);
  }
};