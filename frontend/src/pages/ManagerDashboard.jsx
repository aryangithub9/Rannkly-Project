import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser,updateUser } from '../services/userService';

const ManagerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers(); // Refresh users after deletion
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      await updateUser(userId, { role });
      fetchUsers(); // Refresh users after update
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manager Dashboard</h2>

        {error && (
          <p className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            {error}
          </p>
        )}

        <h3 className="text-xl font-semibold text-gray-700 mb-4">User Management</h3>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">
                    <select
                      value={user.role}
                      onChange={(e) => {
                        const newUsers = users.map((u) =>
                          u._id === user._id ? { ...u, role: e.target.value } : u
                        );
                        setUsers(newUsers);
                      }}
                      className="border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleUpdateUserRole(user._id, user.role)}
                      className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition mr-2"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-500 text-sm"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
