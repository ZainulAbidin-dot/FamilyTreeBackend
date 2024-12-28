import React, { useState } from 'react';
import { motion } from 'framer-motion';

const UserList = ({ users, onEdit, onDelete, refetching, pendingChanges }) => {
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState(null);

  const handleEditClick = (user) => {
    setEditingUserId(user.id); // Set the current user to edit
    setEditedUser({ ...user }); // Initialize edited user data
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev, // Spread the previous state
      [name]: value, // Update only the field that changed
    }));
  };

  const handleSave = async () => {
    if (editedUser) {
      await onEdit(editedUser); // Pass the updated user to the parent component
      setEditingUserId(null); // Exit edit mode
      setEditedUser(null); // Clear the form state
    }
  };

  const handleCancel = () => {
    setEditingUserId(null); // Exit edit mode
    setEditedUser(null); // Clear the form state
  };

  const handleDeleteClick = (userId) => {
    if (confirm('Are you sure you want to delete this family?')) {
      onDelete(userId);
    }
  };

  return (
    <motion.div
      className='p-4 bg-white shadow-md rounded-lg mt-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className='text-2xl font-semibold mb-4'>Family List</h2>
      {users.length === 0 ? (
        <p className='text-gray-600'>
          No users available. Add some users to see them here.
        </p>
      ) : (
        <div className='overflow-x-auto'>
          <table
            className={`w-full border-collapse ${refetching ? 'animate-pulse' : ''}`}
          >
            <thead>
              <tr className='bg-gray-100'>
                <th className='p-2 border border-gray-300 text-left'>ID</th>
                <th className='p-2 border border-gray-300 text-left'>Family Head Name</th>
                <th className='p-2 border border-gray-300 text-left'>Family Name</th>
                <th className='p-2 border border-gray-300 text-left'>Member Count</th>
                <th className='p-2 border border-gray-300 text-left'>Order</th>
                <th className='p-2 border border-gray-300 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  className='hover:bg-gray-50'
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {editingUserId === user.id ? (
                    <>
                      <td className='p-2 border border-gray-300'>{index + 1}</td>
                      <td className='p-2 border border-gray-300'>
                        <input
                          type='text'
                          name='familyHeadName'
                          value={editedUser.familyHeadName}
                          onChange={handleInputChange}
                          className='w-full p-1 border border-gray-300 rounded'
                        />
                      </td>
                      <td className='p-2 border border-gray-300'>
                        <input
                          type='text'
                          name='familyName'
                          value={editedUser.familyName}
                          onChange={handleInputChange}
                          className='w-full p-1 border border-gray-300 rounded'
                        />
                      </td>
                      <td className='p-2 border border-gray-300'>
                        <input
                          type='text'
                          value={editedUser.memberCount}
                          className='w-full p-1 border border-gray-300 rounded'
                          readOnly
                          disabled
                        />
                      </td>
                      <td className='p-2 border border-gray-300'>
                        <input
                          type='number'
                          name='order'
                          value={editedUser.order}
                          onChange={handleInputChange}
                          className='w-full p-1 border border-gray-300 rounded'
                        />
                      </td>
                      <td className='p-2 border border-gray-300'>
                        <button
                          onClick={handleSave}
                          className='mr-2 text-green-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
                          disabled={pendingChanges}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className='text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
                          disabled={pendingChanges}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className='p-2 border border-gray-300'>{index + 1}</td>
                      <td className='p-2 border border-gray-300'>
                        {user.familyHeadName}
                      </td>
                      <td className='p-2 border border-gray-300'>{user.familyName}</td>
                      <td className='p-2 border border-gray-300'>{user.memberCount}</td>
                      <td className='p-2 border border-gray-300'>{user.order}</td>
                      <td className='p-2 border border-gray-300'>
                        <button
                          onClick={() => handleEditClick(user)}
                          className='mr-2 text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
                          disabled={pendingChanges}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className='text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
                          disabled={pendingChanges}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default UserList;
