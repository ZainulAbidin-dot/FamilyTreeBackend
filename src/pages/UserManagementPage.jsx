import React, { useState } from 'react';
import UserForm from '../components/UserManagement/UserForm';
import UserList from '../components/UserManagement/UserList';
import { useAxiosQuery } from '../hooks/useAxiosQuery';
import { axiosClient } from '../axios-client';
import { Loader } from '../components/loader/Loader';
import { toast } from 'react-hot-toast';
import { Container } from '../components/common/Container';

const UserManagementPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);

  const { data: familiesData, loading: familiesLoading } = useAxiosQuery('/families', {
    transformData: (data) => {
      const users = data.map((user) => {
        return {
          id: user.id,
          familyHeadName: user.family_head_name,
          familyName: user.family_name,
          order: user.order,
        };
      });

      const familiesMap = data.reduce((acc, family) => {
        acc.set(family.id, family.family_name);
        return acc;
      }, new Map());

      return { users, familiesMap };
    },
  });

  const {
    data: familyMembers,
    setData: setRawFamilyMembers,
    loading: familyMembersLoading,
    refetch,
    refetching,
  } = useAxiosQuery('/family-members', {
    transformData: (data) => {
      const members = data.map((member) => {
        return {
          id: member.id,
          name: member.name,
          memberAs: member.member_as,
          familyId: member.family_id,
          parentFamily: member.sub_family_of,
          imageFile: member.member_image,
          order: member.order,
        };
      });

      return members;
    },
  });

  const loading = familiesLoading || familyMembersLoading;

  if (loading) return <Loader />;

  const families = familiesData.users;
  const familiesMap = familiesData.familiesMap;

  const handleAddUser = async (userData) => {
    setPendingChanges(true);
    const promise = axiosClient.post('/family-members', {
      name: userData.name,
      member_as: userData.memberAs,
      family_id: userData.familyId,
      sub_family_of: userData.parentFamily === 'None' ? null : userData.parentFamily,
      member_image: userData.imageFile,
      order: userData.order,
    });

    toast
      .promise(promise, {
        loading: 'Adding Family Member...',
        success: 'Family Member Added Successfully',
        error: 'Error Adding Family Member',
      })
      .then(() => {
        refetch();
      })
      .finally(() => {
        setPendingChanges(false);
        setIsFormVisible(false);
      });
  };

  const handleEditUser = async (updatedUser) => {
    setPendingChanges(true);
    const promise = axiosClient.put(`/family-members/${updatedUser.id}`, {
      name: updatedUser.name,
      member_as: updatedUser.memberAs,
      family_id: parseInt(updatedUser.familyId),
      sub_family_of:
        updatedUser.parentFamily === 'None' ? null : parseInt(updatedUser.parentFamily),
      member_image: updatedUser.imageFile,
      order: parseInt(updatedUser.order),
    });

    toast
      .promise(promise, {
        loading: 'Updating Family Member...',
        success: 'Family Member Updated Successfully',
        error: 'Error Updating Family Member',
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
    const promise = axiosClient.delete(`/family-members/${userId}`);

    toast
      .promise(promise, {
        loading: 'Deleting Family Member...',
        success: 'Family Member Deleted Successfully',
        error: 'Error Deleting Family Member',
      })
      .then(() => {
        setRawFamilyMembers((prevData) => prevData.filter((user) => user.id !== userId));
      })
      .finally(() => {
        setPendingChanges(false);
      });
  };

  const familyNameOptions = families.map((family) => ({
    label: family.familyName,
    value: family.id,
  }));

  const parentFamilyOptions = [{ label: 'None', value: 'None' }, ...familyNameOptions];

  return (
    <Container>
      <h1 className='text-3xl font-bold mb-4'>Member Management</h1>

      {/* Button to add a new user */}
      <button
        onClick={() => {
          if (familyNameOptions.length > 0 && parentFamilyOptions.length > 0) {
            setIsFormVisible((prev) => !prev);
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
          onSave={handleAddUser}
          onCancel={() => setIsFormVisible(false)}
          familyNameOptions={familyNameOptions}
          parentFamilyOptions={parentFamilyOptions}
          pendingChanges={pendingChanges}
        />
      )}

      <UserList
        refetching={refetching}
        familyMembers={familyMembers}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        familyNameOptions={familyNameOptions}
        parentFamilyOptions={parentFamilyOptions}
        pendingChanges={pendingChanges}
        familiesMap={familiesMap}
        families={familiesData.users}
      />
    </Container>
  );
};

export default UserManagementPage;
