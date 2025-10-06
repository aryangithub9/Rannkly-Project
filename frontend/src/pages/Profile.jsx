import React from 'react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();
  console.log(user);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-600">{user.name.charAt(0)}</span>
          </div>
          <div className="ml-4">
            <p className="text-xl font-bold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Role</h3>
          <p className="text-gray-800">{user.role}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;