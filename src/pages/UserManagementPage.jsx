import React, { useEffect, useState } from 'react';
import UserForm from '../components/UserManagement/UserForm';

import { axiosClient } from '../axios-client';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // Track the visibility of the form
  const [familiesData, setFamiliesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const familiesData = await axiosClient.get('/families');

      setFamiliesData(
        familiesData.data.map((family) => {
          return {
            id: family.id,
            familyHeadName: family.family_head_name,
            familyName: family.family_name,
            order: family.order,
          };
        })
      );

      const familyMembersData = await axiosClient.get('/family-members');

      const familiesMap = familiesData.data.reduce((acc, family) => {
        acc[family.id] = family.family_name; // Assuming family name is in the 'family_name' field
        return acc;
      }, {});

      const populateUser = familyMembersData.data.map((user) => {
        const familyName = familiesMap[user.family_id]; // Look up the family name by family_id
        const parentFamilyName = user.sub_family_of
          ? familiesMap[user.sub_family_of]
          : 'None'; // If sub_family_of is not null, get the parent family name

        return {
          id: user.id,
          name: user.name,
          memberAs: user.member_as,
          familyName: familyName,
          partOfFamily: parentFamilyName,
          imageFile: user.member_image,
        };
      });
      setUsers(populateUser);
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleAddOrUpdateUser = async (userData) => {
    console.log(userData.partOfFamily);
    let partOfFamilyData = {};
    if (
      userData.partOfFamily !== 'None' &&
      userData.partOfFamily !== '' &&
      userData.partOfFamily !== null
    ) {
      const { data } = await axiosClient
        .get(`/families-single?name=${encodeURIComponent(userData.partOfFamily)}`)
        .catch((err) => console.log(err));

      partOfFamilyData = data;
    }

    const familyNameData = await axiosClient
      .get(`/families-single?name=${encodeURIComponent(userData.familyName)}`)
      .catch((err) => console.log(err));

    console.log(familyNameData);

    const { data } = await axiosClient
      .post('/family-members', {
        name: userData.name,
        member_as: userData.memberAs,
        family_name: familyNameData.data.id,
        sub_family_of: userData.partOfFamily === 'None' ? null : partOfFamilyData.id,
        member_image: userData.imageFile,
      })
      .catch((err) => console.log(err));

    alert('Family Member Added Successfully');

    if (selectedUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, ...userData } : user
        )
      );
    } else {
      setUsers((prevUsers) => [...prevUsers, { id: data.id, ...userData }]);
    }
    setSelectedUser(null);
    setIsFormVisible(false); // Hide form after adding/updating the user
  };

  const handleEditUser = async (updatedUser) => {
    console.log(updatedUser);
    let partOfFamilyData = {};
    if (updatedUser.partOfFamily !== 'None') {
      const { data } = await axiosClient.get(
        `/families-single?name=${encodeURIComponent(updatedUser.partOfFamily)}`
      );

      partOfFamilyData = data;
    }

    const familyNameData = await axiosClient.get(
      `/families-single?name=${encodeURIComponent(updatedUser.familyName)}`
    );

    const { data } = await axiosClient.put(`/family-members/${updatedUser.id}`, {
      name: updatedUser.name,
      member_as: updatedUser.memberAs,
      family_name: familyNameData.data.id,
      sub_family_of: updatedUser.partOfFamily === 'None' ? null : partOfFamilyData.id,
      member_image: updatedUser.imageFile,
    });

    alert('Family Member Updated Successfully');
    // setSelectedUser(editUser);
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleDeleteUser = async (userId) => {
    await axiosClient.delete(`/family-members/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    alert('Family Member Deleted Successfully');
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
    setIsFormVisible(false); // Hide form when canceling
  };

  const handleDataImport = (importedData) => {
    setUsers((prevUsers) => [...prevUsers, ...importedData]);
  };

  const uniqueFamilyNames = [...new Set(familiesData.map((user) => user.familyName))];
  const uniquePartOfFamily = [
    'None',
    ...new Set(familiesData.map((user) => user.familyName)),
  ];

  const familyNameOptions = uniqueFamilyNames.map((name) => ({
    value: name,
    label: name,
  }));
  const partOfFamilyOptions = uniquePartOfFamily.map((type) => ({
    value: type,
    label: type,
  }));

  return (
    <div className='container mx-auto mt-20 p-6'>
      <h1 className='text-3xl font-bold mb-4'>Member Management</h1>
      {/* <CsvImport onDataImported={handleDataImport} /> */}

      {/* Button to add a new user */}
      <button
        onClick={() => {
          if (familyNameOptions.length > 0 && partOfFamilyOptions.length > 0) {
            setIsFormVisible((prev) => !prev);
            setSelectedUser(null); // Make sure selectedUser is null when adding new user
          } else {
            alert('Add a Family First');
          }
        }}
        className='my-4 p-2 bg-blue-500 text-white rounded'
      >
        Add New Member
      </button>

      {/* Show the UserForm when the form visibility is true */}
      {isFormVisible && (
        <UserForm
          user={selectedUser}
          onSave={handleAddOrUpdateUser}
          onCancel={handleCancelEdit}
          familyNameOptions={familyNameOptions}
          partOfFamilyOptions={partOfFamilyOptions}
        />
      )}

      <UserList
        loading={loading}
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        familyNameOptions={familyNameOptions}
        partOfFamilyOptions={partOfFamilyOptions}
      />

      {/* <ExportButton data={users} /> */}
    </div>
  );
};

export default UserManagementPage;
