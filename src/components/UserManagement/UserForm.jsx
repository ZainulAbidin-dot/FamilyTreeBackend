import React, { useState } from 'react';

const UserForm = ({
  onSave,
  onCancel,
  familyNameOptions,
  parentFamilyOptions,
  pendingChanges,
}) => {
  const [userData, setUserData] = useState({
    name: '',
    memberAs: '',
    familyId: familyNameOptions.length > 0 ? familyNameOptions[0].value : null,
    parentFamily: parentFamilyOptions.length > 0 ? parentFamilyOptions[0].value : null,
    imageFile: null,
    order: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the file from the input
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData) => ({
          ...prevData,
          imageFile: reader.result, // Set the image as a base64 string (you can also upload the file to a server if needed)
        }));
      };
      reader.readAsDataURL(file); // Convert the image to base64
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(userData); // Save the new/edited user
  };

  return (
    <div className='mb-4 p-4 bg-white shadow-md rounded-lg'>
      <h2 className='text-xl font-semibold mb-4'>Add New Member</h2>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className='mb-4'>
          <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
            Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={userData.name}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded'
            required
            readOnly={pendingChanges}
          />
        </div>

        {/* Member As Field */}
        <div className='mb-4'>
          <label htmlFor='memberAs' className='block text-sm font-medium text-gray-700'>
            Member As
          </label>
          <select
            id='memberAs'
            name='memberAs'
            value={userData.memberAs}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded'
            required
            readOnly={pendingChanges}
          >
            <option value=''>Select Role</option>
            <option value='Son'>Son</option>
            <option value='Daughter'>Daughter</option>
            <option value='Patriarch'>Patriarch</option>
            <option value='Matriarch'>Matriarch</option>
            <option value='Patriarch_Father'>Patriarch's Father</option>
            <option value='Patriarch_Mother'>Patriarch's Mother</option>
            <option value='Matriarch_Father'>Matriarch's Father</option>
            <option value='Matriarch_Mother'>Matriarch's Mother</option>
          </select>
        </div>

        {/* Family Name Field */}
        <div className='mb-4'>
          <label htmlFor='memberAs' className='block text-sm font-medium text-gray-700'>
            Family Name
          </label>
          <select
            name='familyId'
            defaultValue={familyNameOptions[0].value}
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
        </div>

        {/* Part of Family Field */}
        <div className='mb-4'>
          <label htmlFor='memberAs' className='block text-sm font-medium text-gray-700'>
            Parent Family
          </label>
          <select
            name='parentFamily'
            defaultValue={parentFamilyOptions[0].value}
            onChange={handleInputChange}
            className='w-full p-1 border border-gray-300 rounded'
            readOnly={pendingChanges}
          >
            {parentFamilyOptions.map((parentFamily) => (
              <option key={parentFamily.value} value={parentFamily.value}>
                {parentFamily.label}
              </option>
            ))}
          </select>
        </div>

        {/* Order Field */}
        <div className='mb-4'>
          <label htmlFor='order' className='block text-sm font-medium text-gray-700'>
            Order
          </label>
          <input
            type='number'
            id='order'
            name='order'
            min={0}
            value={userData.order}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded'
            readOnly={pendingChanges}
          />
        </div>

        {/* Image Upload Field */}
        <div className='mb-4'>
          <label htmlFor='image' className='block text-sm font-medium text-gray-700'>
            Upload Image
          </label>
          <input
            type='file'
            id='image'
            name='image'
            onChange={handleImageChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded'
            accept='image/*'
            readOnly={pendingChanges}
          />
        </div>

        {/* Image Preview (if image is uploaded) */}
        {userData.imageFile && (
          <div className='mb-4'>
            <img
              src={userData.imageFile}
              alt='Uploaded'
              className='w-32 h-32 object-cover border border-gray-300 rounded'
            />
          </div>
        )}

        {/* Submit and Cancel Buttons */}
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
            Save New User
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
