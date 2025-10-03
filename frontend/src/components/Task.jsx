import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

const Task = ({ task, setTaskToEdit }) => {
  const { deleteTask, updateTask } = useTasks();
  const { user } = useAuth();

  const canUpdate = user.role === 'Admin' || user.role === 'Manager' || user._id === task.createdBy._id;
  const canDelete = user.role === 'Admin' || user.role === 'Manager' || user._id === task.createdBy._id;
  const canUpdateStatus = canUpdate || user._id === task.assignedTo._id;

  return (
    <div style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
      <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
      <p>Assigned To: {task.assignedTo.name}</p>
      <p>Created By: {task.createdBy.name}</p>
      {canUpdate && <button onClick={() => setTaskToEdit(task)}>Edit</button>}
      {canDelete && <button onClick={() => deleteTask(task._id)}>Delete</button>}
      {canUpdateStatus && (
        <select value={task.status} onChange={(e) => updateTask(task._id, { status: e.target.value })}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
        </select>
      )}
    </div>
  );
};

export default Task;
