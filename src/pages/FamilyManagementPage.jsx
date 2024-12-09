import React, { useEffect, useState } from 'react';
import UserForm from '../components/FamilyManagement/UserForm';
import UserList from '../components/FamilyManagement/UserList';
import CsvImport from '../components/CsvImport';
import ExportButton from '../components/ExportButton/ExportButton';
import axios from 'axios';

const FamilyManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // Track the visibility of the form

  useEffect(() => {
    async function fetchData() {
      const {data} = await axios.get('https://family-tree-backend-production-630e.up.railway.app/families', {
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
      console.log(populateUser);
      setUsers(populateUser) 
    }

    fetchData();
  
  }, [])

  const handleAddOrUpdateUser = async (userData) => {
    
    const {data} = await axios.post('https://family-tree-backend-production-630e.up.railway.app/families', {
      family_head_name: userData.familyHeadName,
      family_name: userData.familyName
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    alert('Family Added Successfully');
    if (selectedUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, ...userData } : user
        )
      );
    } else {
      setUsers((prevUsers) => [
        ...prevUsers,
        { id: data.id, ...userData },
      ]);
    }
    setSelectedUser(null);
    setIsFormVisible(false); // Hide form after adding/updating the user
    setFilteredData(users)

  };

  const handleEditUser = async (updatedUser) => {
    const {data} = await axios.put(`https://family-tree-backend-production-630e.up.railway.app/families/${updatedUser.id}`, {
      family_head_name: updatedUser.familyHeadName,
      family_name: updatedUser.familyName
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    alert('Family Updated Successfully');
    // setSelectedUser(editUser);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    setFilteredData(users)
    // setIsFormVisible(true); // Show form for editing
  };

  const handleDeleteUser = async (userId) => {
    await axios.delete(`https://family-tree-backend-production-630e.up.railway.app/families/${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    alert('Family Deleted Successfully');
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
    setIsFormVisible(false); // Hide form when canceling
  };

  const handleDataImport = (importedData) => {
    setUsers(prevUsers => [...prevUsers, ...importedData]);
  };

  return (
    <div className="container mx-auto mt-20 p-6">
      <h1 className="text-3xl font-bold mb-4">Family Management</h1>
      {/* <CsvImport onDataImported={handleDataImport} /> */}

      {/* Button to add a new user */}
      <button
        onClick={() => {
          setIsFormVisible(prev => !prev);
          setSelectedUser(null); // Make sure selectedUser is null when adding new user
        }}
        className="my-4 p-2 bg-blue-500 text-white rounded"
      >
        Add New Family
      </button>

      {/* Show the UserForm when the form visibility is true */}
      {isFormVisible && (
        <UserForm
          user={selectedUser}
          onSave={handleAddOrUpdateUser}
          onCancel={handleCancelEdit}
        />
      )}

      <UserList
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {/* <ExportButton data={users} /> */}
    </div>
  );
};

export default FamilyManagementPage;
