import React from 'react';
import { useAuth } from '../context/AuthContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome, <span className="font-semibold text-indigo-600">{user?.name}</span> 🎉
          </p>
          <p className="text-sm text-gray-500">
            Your role: <span className="font-medium text-gray-700">{user?.role}</span>
          </p>
        </div>

        {/* Task Form Section (Only if user is NOT employee) */}
        {user?.role !== 'Employee' && (
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
            <TaskForm />
          </div>
        )}

        {/* Task List Section */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks</h2>
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
