import React, { useState } from 'react';
import UserForm from '../components/UserManagement/UserForm';
import UserList from '../components/UserManagement/UserList';
import { useAxiosQuery } from '../hooks/useAxiosQuery';
import { axiosClient } from '../axios-client';
import { Loader } from '../components/loader/Loader';
import { toast } from 'react-hot-toast';

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

      const familiesNameToId = data.reduce((acc, family) => {
        acc.set(family.family_name, family.id);
        return acc;
      }, new Map());

      return { users, familiesMap, familiesNameToId };
    },
  });

  const {
    data: rawFamilyMembers,
    loading: familyMembersLoading,
    refetch,
    refetching,
  } = useAxiosQuery('/family-members');

  const loading = familiesLoading || familyMembersLoading;

  if (loading) return <Loader />;

  const families = familiesData.users;
  const familiesMap = familiesData.familiesMap;
  const familiesNameToId = familiesData.familiesNameToId;

  const familyMembers = rawFamilyMembers.map((user) => {
    const familyName = familiesMap.get(user.family_id);
    const parentFamilyName = user.sub_family_of
      ? familiesMap.get(user.sub_family_of)
      : 'None';

    return {
      id: user.id,
      name: user.name,
      memberAs: user.member_as,
      familyName: familyName,
      partOfFamily: parentFamilyName,
      imageFile: user.member_image,
    };
  });

  const handleAddUser = async (userData) => {
    setPendingChanges(true);
    const promise = axiosClient.post('/family-members', {
      name: userData.name,
      member_as: userData.memberAs,
      family_name: userData.familyName,
      sub_family_of: userData.partOfFamily === 'None' ? null : userData.partOfFamily,
      member_image: userData.imageFile,
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
      family_name: updatedUser.familyName,
      sub_family_of:
        updatedUser.partOfFamily === 'None' ? null : updatedUser.partOfFamily,
      member_image: updatedUser.imageFile,
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
        refetch();
      })
      .finally(() => {
        setPendingChanges(false);
      });
  };

  const familyNameOptions = families.map((family) => ({
    label: family.familyName,
    value: family.id,
  }));

  const partOfFamilyOptions = [{ label: 'None', value: 'None' }, ...familyNameOptions];

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-4'>Member Management</h1>

      {/* Button to add a new user */}
      <button
        onClick={() => {
          if (familyNameOptions.length > 0 && partOfFamilyOptions.length > 0) {
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
          onCancel={handleCancelEdit}
          familyNameOptions={familyNameOptions}
          partOfFamilyOptions={partOfFamilyOptions}
          pendingChanges={pendingChanges}
        />
      )}

      <UserList
        refetching={refetching}
        users={familyMembers}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        familyNameOptions={familyNameOptions}
        partOfFamilyOptions={partOfFamilyOptions}
        pendingChanges={pendingChanges}
        familiesNameToId={familiesNameToId}
      />
    </div>
  );
};

export default UserManagementPage;
