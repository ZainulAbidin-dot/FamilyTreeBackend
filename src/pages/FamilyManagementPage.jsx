import React, { useState } from 'react';
import UserForm from '../components/FamilyManagement/UserForm';
import UserList from '../components/FamilyManagement/UserList';
import { axiosClient } from '../axios-client';
import { useAxiosQuery } from '../hooks/useAxiosQuery';
import { Loader } from '../components/loader/Loader';
import { toast } from 'react-hot-toast';
import { Container } from '../components/common/Container';

const FamilyManagementPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // Track the visibility of the form
  const [pendingChanges, setPendingChanges] = useState(false);

  const {
    data: users,
    setData: setUsers,
    refetch,
    refetching,
    loading,
  } = useAxiosQuery('/families');

  const handleAddUser = async (userData) => {
    setPendingChanges(true);
    const promise = axiosClient.post('/families', {
      familyHeadName: userData.familyHeadName,
      familyName: userData.familyName,
      order: userData.order,
    });

    toast
      .promise(promise, {
        loading: 'Adding Family...',
        success: 'Family Added Successfully',
        error: 'Error Adding Family',
      })
      .then(() => {
        refetch();
      })
      .finally(() => {
        setPendingChanges(false);
        setSelectedUser(null);
        setIsFormVisible(false);
      });
  };

  const handleEditUser = async (updatedUser) => {
    setPendingChanges(true);

    const promise = axiosClient.put(`/families/${updatedUser.id}`, {
      familyHeadName: updatedUser.familyHeadName,
      familyName: updatedUser.familyName,
      order: parseInt(updatedUser.order),
    });

    toast
      .promise(promise, {
        loading: 'Updating Family...',
        success: 'Family Updated Successfully',
        error: 'Error Updating Family',
      })
      .then(() => {
        refetch();
      })
      .finally(() => {
        setPendingChanges(false);
      });
  };

  const handleDeleteUser = async (userId) => {
    setPendingChanges(true);
    const promise = axiosClient.delete(`/families/${userId}`);
    toast
      .promise(promise, {
        loading: 'Deleting Family...',
        success: 'Family Deleted Successfully',
        error: 'Error Deleting Family',
      })
      .then(() => {
        setUsers((prevData) => prevData.filter((user) => user.id !== userId));
      })
      .finally(() => {
        setPendingChanges(false);
      });
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
    setIsFormVisible(false); // Hide form when canceling
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h1 className='text-3xl font-bold mb-4'>Family Management</h1>

      <button
        onClick={() => {
          setIsFormVisible((prev) => !prev);
          setSelectedUser(null);
        }}
        className='my-4 p-2 bg-blue-500 text-white rounded'
      >
        Add New Family
      </button>

      {isFormVisible && (
        <UserForm
          user={selectedUser}
          onSave={handleAddUser}
          onCancel={handleCancelEdit}
          pendingChanges={pendingChanges}
        />
      )}

      <UserList
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        refetching={refetching}
        pendingChanges={pendingChanges}
      />
    </Container>
  );
};

export default FamilyManagementPage;
