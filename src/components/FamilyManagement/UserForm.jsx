import React, { useState, useEffect } from 'react';

const UserForm = ({ user, onSave, onCancel, pendingChanges }) => {
  const [userData, setUserData] = useState({
    familyHeadName: '',
    familyName: '',
    order: 1,
  });

  useEffect(() => {
    if (user) {
      setUserData({ ...user }); // Pre-fill the form if editing an existing user
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(userData); // Save the new/edited user
  };

  return (
    <div className='mb-4 p-4 bg-white shadow-md rounded-lg'>
      <h2 className='text-xl font-semibold mb-4'>
        {user ? 'Edit User' : 'Add New Member'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
            Family Head Name
          </label>
          <input
            type='text'
            id='familyHeadName'
            name='familyHeadName'
            value={userData.familyHeadName}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded'
            required
            readOnly={pendingChanges}
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='familyName' className='block text-sm font-medium text-gray-700'>
            Family Name
          </label>
          <input
            type='text'
            id='familyName'
            name='familyName'
            value={userData.familyName}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded'
            required
            readOnly={pendingChanges}
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='order' className='block text-sm font-medium text-gray-700'>
            Family Name
          </label>
          <input
            type='number'
            id='order'
            name='order'
            value={userData.order}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded'
            required
            readOnly={pendingChanges}
          />
        </div>

        <div className='flex justify-end space-x-4'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 text-gray-700 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={pendingChanges}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={pendingChanges}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
