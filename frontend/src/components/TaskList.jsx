import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import Task from './Task';
import TaskForm from './TaskForm';

const TaskList = () => {
  const { tasks, loading } = useTasks();
  const [taskToEdit, setTaskToEdit] = useState(null);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <h2>Tasks</h2>
      {taskToEdit && <TaskForm taskToEdit={taskToEdit} setTaskToEdit={setTaskToEdit} />}
      <div>
        {tasks.map((task) => (
          <Task key={task._id} task={task} setTaskToEdit={setTaskToEdit} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
