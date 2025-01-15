import { useState } from 'react';

export function ImagePicker({ onChange, value}) {
  const [imageFile, setImageFile] = useState(value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
    }
  };

  return (
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
        readOnly={value}
      />
      {imageFile && (
        <img
          src={imageFile}
          alt='Uploaded'
          className='w-32 h-32 object-cover border border-gray-300 rounded'
        />
      )}
    </div>
  );
}