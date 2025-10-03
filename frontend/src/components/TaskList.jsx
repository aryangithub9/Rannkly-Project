import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import Task from './Task';
import TaskForm from './TaskForm';

const TaskList = () => {
  const { tasks, loading } = useTasks();
  const [taskToEdit, setTaskToEdit] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-medium text-gray-600">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        Tasks
      </h2>

      {taskToEdit && (
        <div className="mb-6">
          <TaskForm taskToEdit={taskToEdit} setTaskToEdit={setTaskToEdit} />
        </div>
      )}

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No tasks available.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Task
              key={task._id}
              task={task}
              setTaskToEdit={setTaskToEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
