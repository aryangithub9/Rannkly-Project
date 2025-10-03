import React, { createContext, useState, useContext, useEffect } from 'react';
import * as taskService from '../services/taskService';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await taskService.getTasks();
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
    setLoading(false);
  };

  const createTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      fetchTasks(); // Refresh tasks after creating
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      await taskService.updateTask(id, taskData);
      fetchTasks(); // Refresh tasks after updating
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      fetchTasks(); // Refresh tasks after deleting
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, createTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  return useContext(TaskContext);
};
