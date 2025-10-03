import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { getUsers } from '../services/userService'; // Assuming you might need to assign users

const TaskForm = ({ taskToEdit, setTaskToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const { createTask, updateTask } = useTasks();

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setDueDate(new Date(taskToEdit.dueDate).toISOString().split('T')[0]);
      setAssignedTo(taskToEdit.assignedTo._id);
    }
    // Fetch users for assignment dropdown
    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data.users);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    }
    fetchUsers();
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = { title, description, status, priority, dueDate, assignedTo };
    if (taskToEdit) {
      updateTask(taskToEdit._id, taskData);
    } else {
      createTask(taskData);
    }
    // Reset form
    setTitle('');
    setDescription('');
    setStatus('To Do');
    setPriority('Medium');
    setDueDate('');
    setAssignedTo('');
    if(setTaskToEdit) setTaskToEdit(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{taskToEdit ? 'Edit Task' : 'Create Task'}</h3>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
      <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
        <option value="">Assign to</option>
        {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>
      <button type="submit">{taskToEdit ? 'Update' : 'Create'}</button>
      {taskToEdit && <button onClick={() => setTaskToEdit(null)}>Cancel</button>}
    </form>
  );
};

export default TaskForm;
