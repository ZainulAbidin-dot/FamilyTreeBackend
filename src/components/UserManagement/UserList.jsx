import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression'; 
import axios from 'axios';
import { axiosClient, BACKEND_URL } from '../../axios-client';

const UserList = ({ users, loading, onEdit, onDelete, familyNameOptions, partOfFamilyOptions }) => {
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [familiesData, setFamiliesData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const {data} = await axiosClient.get('/families', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const populateUser = data.map(user => {
        return {
          id: user.id,
          familyHeadName: user.family_head_name,
          familyName: user.family_name
        }
      })
      setFamiliesData(populateUser) 
    }

    fetchData();
  
  }, [editedUser])

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
        // setEditedUser((prevData) => ({
        //   ...prevData,
        //   imageFile: compressedFile,
        // }));

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
    console.log(editedUser)
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

  console.log(editedUser)
  return (
    <motion.div
      className="p-4 bg-white shadow-md rounded-lg mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4">User List</h2>
      {users.length === 0 ? (
        <p className="text-gray-600"> {loading ? "Loading..." : "No users available. Add some users to see them here."}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border border-gray-300 text-left">ID</th>
                <th className="p-2 border border-gray-300 text-left">Image</th> {/* Image column */}
                <th className="p-2 border border-gray-300 text-left">Name</th>
                <th className="p-2 border border-gray-300 text-left">Member As</th>
                <th className="p-2 border border-gray-300 text-left">Family Name</th>
                <th className="p-2 border border-gray-300 text-left">Parent Family</th>
                <th className="p-2 border border-gray-300 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {editingUserId === user.id ? (
                    <>
                      <td className="p-2 border border-gray-300">{user.id}</td>
                      {/* Image upload field */}
                      <td className="p-2 border border-gray-300">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                        {editedUser.imageFile && (
                          <img
                            src={editedUser.imageFile.startsWith('data:image/jpeg;base64') ? editedUser.imageFile : `${BACKEND_URL}/${editedUser.imageFile}`}
                            alt="Preview"
                            className="w-16 h-16 object-cover mt-2"
                          />
                        )}
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input
                          type="text"
                          name="name"
                          value={editedUser.name}
                          onChange={handleInputChange}
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="p-2 border border-gray-300">
                        <select
                          name="memberAs"
                          value={editedUser.memberAs} // Controlled value
                          onChange={handleInputChange} // Handle change
                          className="w-full p-1 border border-gray-300 rounded"
                        >
                          {memberAsOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 border border-gray-300">
                        <select
                          name="familyName"
                          value={editedUser.familyName.value}
                          onChange={handleInputChange}
                          className="w-full p-1 border border-gray-300 rounded"
                        >
                          {familyNameOptions.map(familyName => (
                            <option key={familyName.value} value={familyName.value}>
                              {familyName.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 border border-gray-300">
                        <select
                          name="partOfFamily"
                          defaultValue={editedUser.partOfFamily.value}
                          onChange={handleInputChange}
                          className="w-full p-1 border border-gray-300 rounded"
                        >
                          {partOfFamilyOptions.map(partOfFamily => (
                            <option key={partOfFamily.value} value={partOfFamily.value}>
                              {partOfFamily.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 border border-gray-300">
                        <button
                          onClick={handleSave}
                          className="mr-2 text-green-600 hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-600 hover:underline"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2 border border-gray-300">{index + 1}</td>
                      {/* Image display */}
                      <td className="p-2 border border-gray-300">
                        {user.imageFile ? (
                          <img
                            src={user.imageFile.startsWith('data:image/jpeg;base64') ? user.imageFile : `${BACKEND_URL}/${user.imageFile}`}
                            alt="User"
                            className="w-16 h-16 object-cover rounded-full"
                          />
                        ) : (
                          <p>No image</p>
                        )}
                      </td>
                      <td className="p-2 border border-gray-300">{user.name}</td>
                      <td className="p-2 border border-gray-300">{user.memberAs}</td>
                      <td className="p-2 border border-gray-300">{user.familyName}</td>
                      <td className="p-2 border border-gray-300">{user.partOfFamily === null || user.partOfFamily === "" ? "None" : user.partOfFamily}</td>
                      <td className="p-2 border border-gray-300">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="mr-2 text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(user.id)}
                          className="text-red-600 hover:underline"
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
