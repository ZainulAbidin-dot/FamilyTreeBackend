import React, { useState } from 'react';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { BACKEND_URL } from '../../axios-client';

const UserList = ({
  familyMembers,
  onEdit,
  onDelete,
  familyNameOptions,
  parentFamilyOptions,
  refetching,
  pendingChanges,
  familiesMap,
  families,
}) => {
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState('all');
  const [sortOrderOfOrder, setSortOrderOfOrder] = useState('none');

  const handleEditClick = (user) => {
    setEditingUserId(user.id); // Set the current user to edit
    setEditedUser({ ...user }); // Initialize edited user data
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const options = {
      maxSizeMB: 1, // 1 MB
      maxWidthOrHeight: 1024, // Resizing the image
      useWebWorker: true,
    };
    if (file) {
      try {
        const compressedFile = await imageCompression(file, options);

        const reader = new FileReader();
        reader.onloadend = () => {
          setEditedUser((prevData) => ({
            ...prevData,
            imageFile: reader.result, // Save the base64 string of the image
          }));
        };
        reader.readAsDataURL(compressedFile); // Convert image to base64 string
      } catch (error) {
        console.error('Error compressing the image:', error);
      }
    }
  };

  const handleSave = () => {
    if (editedUser) {
      onEdit(editedUser); // Pass the updated user to the parent component

      setEditingUserId(null); // Exit edit mode
      setEditedUser(null); // Clear the form state
    }
  };

  const handleCancel = () => {
    setEditingUserId(null); // Exit edit mode
    setEditedUser(null); // Clear the form state
  };

  const memberAsOptions = [
    { value: 'Son', label: 'Son' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Patriarch', label: 'Patriarch' },
    { value: 'Matriarch', label: 'Matriarch' },
    { value: 'Patriarch_Father', label: 'Patriarch Father' },
    { value: 'Patriarch_Mother', label: 'Patriarch Mother' },
    { value: 'Matriarch_Father', label: 'Matriarch Father' },
    { value: 'Matriarch_Mother', label: 'Matriarch Mother' },
  ];

  const filteredUsers =
    selectedFamily === 'all'
      ? familyMembers
      : familyMembers.filter((user) => user.familyId === parseInt(selectedFamily));

  return (
    <motion.div
      className='p-4 bg-white shadow-md rounded-lg mt-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex items-center justify-between mb-4 gap-4'>
        <h2 className='text-2xl font-semibold'>
          User List (Total: {familyMembers.length})
        </h2>

        <select
          className='p-2 border border-gray-300 rounded'
          value={selectedFamily}
          onChange={(e) => setSelectedFamily(e.target.value)}
        >
          <option value='all'>All</option>
          {families.map((family) => (
            <option key={family.id} value={family.id}>
              {family.familyName}
            </option>
          ))}
        </select>
      </div>
      {filteredUsers.length === 0 ? (
        <p className='text-gray-600'>
          No users available. Add some users to see them here
        </p>
      ) : (
        <div className='overflow-x-auto'>
          <table
            className={`w-full border-collapse ${refetching ? 'animate-pulse' : ''}`}
          >
            <thead>
              <tr className='bg-gray-100'>
                <th className='p-2 border border-gray-300 text-left'>ID</th>
                <th className='p-2 border border-gray-300 text-left'>Image</th>
                <th className='p-2 border border-gray-300 text-left'>Name</th>
                <th className='p-2 border border-gray-300 text-left'>Member As</th>
                <th className='p-2 border border-gray-300 text-left'>Family Name</th>
                <th className='p-2 border border-gray-300 text-left'>Parent Family</th>
                <th className='p-2 border border-gray-300 text-left'>Order</th>
                <th className='p-2 border border-gray-300 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className='hover:bg-gray-50'>
                  {editingUserId === user.id ? (
                    <>
                      <td className='p-2 border border-gray-300'>{user.id}</td>
                      {/* Image upload field */}
                      <td className='p-2 border border-gray-300'>
                        <input
                          type='file'
                          accept='image/*'
                          onChange={handleImageChange}
                          className='w-full p-1 border border-gray-300 rounded'
                          readOnly={pendingChanges}
                        />
                        {editedUser.imageFile && (
                          <img
                            src={
                              editedUser.imageFile.startsWith('data:image')
                                ? editedUser.imageFile
                                : `${BACKEND_URL}/${editedUser.imageFile}`
                            }
                            alt='Preview'
                            className='w-16 h-16 object-cover mt-2'
                          />
                        )}
                      </td>
                      <td className='p-2 border border-gray-300'>
                        <input
                          type='text'
                          name='name'
                          value={editedUser.name}
                          onChange={handleInputChange}
                          className='w-full p-1 border border-gray-300 rounded'
                          readOnly={pendingChanges}
                        />
                      </td>
                      <td className='p-2 border border-gray-300'>
                        <select
                          name='memberAs'
                          value={editedUser.memberAs} // Controlled value
                          onChange={handleInputChange} // Handle change
                          className='w-full p-1 border border-gray-300 rounded'
                          readOnly={pendingChanges}
                        >
                          {memberAsOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className='p-2 border border-gray-300'>
                        <select
                          name='familyId'
                          value={editedUser.familyId}
                          onChange={handleInputChange}
                          className='w-full p-1 border border-gray-300 rounded'
                          readOnly={pendingChanges}
                        >
                          {familyNameOptions.map((familyName) => (
                            <option key={familyName.value} value={familyName.value}>
                              {familyName.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className='p-2 border border-gray-300'>
                        <select
                          name='parentFamily'
                          value={
                            editedUser.parentFamily === null
                              ? 'None'
                              : editedUser.parentFamily
                          }
                          onChange={handleInputChange}
                          className='w-full p-1 border border-gray-300 rounded'
                          readOnly={pendingChanges}
                        >
                          {parentFamilyOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className='p-2 border border-gray-300'>
                        <input
                          type='number'
                          name='order'
                          min={0}
                          value={editedUser.order}
                          onChange={handleInputChange}
                          className='w-full p-1 border border-gray-300 rounded'
                          readOnly={
                            editedUser.memberAs === 'Patriarch' ||
                            editedUser.memberAs === 'Matriarch' ||
                            pendingChanges
                          }
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
                      <td className='p-2 border border-gray-300'>{user.id}</td>
                      {/* Image display */}
                      <td className='p-2 border border-gray-300'>
                        {user.imageFile ? (
                          <img
                            src={
                              user.imageFile.startsWith('data:image')
                                ? user.imageFile
                                : `${BACKEND_URL}/${user.imageFile}`
                            }
                            alt='User'
                            className='w-16 h-16 object-cover rounded-full'
                            loading='lazy'
                          />
                        ) : (
                          <p>No image</p>
                        )}
                      </td>
                      <td className='p-2 border border-gray-300'>{user.name}</td>
                      <td className='p-2 border border-gray-300'>{user.memberAs}</td>
                      <td className='p-2 border border-gray-300'>
                        {familiesMap.get(user.familyId)}
                      </td>
                      <td className='p-2 border border-gray-300'>
                        {user.parentFamily === null
                          ? 'None'
                          : familiesMap.get(user.parentFamily)}
                      </td>
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
                          onClick={() => onDelete(user.id)}
                          className='text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
                          disabled={pendingChanges}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default UserList;
