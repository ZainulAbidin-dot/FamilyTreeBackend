import { useState } from 'react';
import toast from 'react-hot-toast';

export const AddSongForm = ({ onSave, onCancel, pendingChanges }) => {
  const [formData, setFormData] = useState({
    fileBase64: '',
    fileName: '',
    fileType: '',
  });

  function handleFileChange(e) {
    const file = e.target?.files?.[0];

    if (!file) return;

    // check if it is a valid audio file. it must be less than 2MB
    if (file instanceof File) {
      // check if it is an audio file
      const fileType = file.type;
      if (!fileType.startsWith('audio/')) {
        toast.error('File must be an audio file');
        return;
      }

      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size must be less than 10MB');
        return;
      }

      // create a preview URL for the audio file
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          fileBase64: e.target.result,
          fileName: file.name,
          fileType: fileType,
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Invalid file');
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Save the new/edited user
  };

  return (
    <div className='mb-4 p-4 bg-white shadow-md rounded-lg'>
      <h2 className='text-xl font-semibold mb-4'>Add a new song</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='songFile' className='block text-sm font-medium text-gray-700'>
            Song File
          </label>
          <input
            type='file'
            id='songFile'
            name='songFile'
            onChange={handleFileChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:text-gray-700 file:bg-gray-100 hover:file:bg-gray-200 file:cursor-pointer'
            accept='audio/*'
            readOnly={pendingChanges}
            required
          />
        </div>

        {formData.fileBase64 && (
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>
              Song Preview
            </label>
            <audio controls className='w-full'>
              <source src={formData.fileBase64} type='audio/mpeg' />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

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
