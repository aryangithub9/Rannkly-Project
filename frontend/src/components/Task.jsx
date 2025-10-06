import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

const Task = ({ task, setTaskToEdit }) => {
  const { deleteTask, updateTask } = useTasks();
  const { user } = useAuth();


  const canUpdate = user.role === 'Admin' || user.role === 'Manager' || user.email === task.createdBy.email;
  const canDelete = user.role === 'Admin' || user.role === 'Manager' || user.email === task.createdBy.email;
  const canUpdateStatusOrPriority =
    user.role === 'Admin' ||
    user.role === 'Manager' ||
    user.email === task.assignedTo.email; 

  return (
    <div className="bg-white shadow-md rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 transition hover:shadow-lg">
      <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
      <p className="text-gray-600 mt-1">{task.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm text-gray-700">
        <p><span className="font-medium">Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}</p>
        <p><span className="font-medium">Assigned To:</span> {task.assignedTo.name}</p>
        <p><span className="font-medium">Created By:</span> {task.createdBy.name}</p>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {canUpdateStatusOrPriority ? (
          <>
            <select
              value={task.status}
              onChange={(e) => updateTask(task._id, { status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <select
              value={task.priority}
              onChange={(e) => updateTask(task._id, { priority: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </>
        ) : (
          <>
            <p><span className="font-medium">Status:</span> {task.status}</p>
            <p><span className="font-medium">Priority:</span> {task.priority}</p>
          </>
        )}
        {canUpdate && (
          <button
            onClick={() => setTaskToEdit(task)}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
          >
            Edit
          </button>
        )}
        {canDelete && (
          <button
            onClick={() => deleteTask(task._id)}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Task;
