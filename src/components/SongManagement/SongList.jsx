import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BACKEND_URL } from '../../axios-client';
import toast from 'react-hot-toast';

import { FaXmark, FaCheck } from 'react-icons/fa6';

export const SongList = ({ songs, onEdit, onDelete, refetching, pendingChanges }) => {
  const [editingId, setEditingId] = useState(null);

  const handleEditClick = (song) => {
    setEditingId(song.id);
  };

  const handleSave = async (songData) => {
    await onEdit(songData);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <motion.div
      className='p-4 bg-white shadow-md rounded-lg mt-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className='text-2xl font-semibold mb-4'>Songs List</h2>
      {songs.length === 0 ? (
        <p className='text-gray-600'>
          No songs available. Add some songs to see them here.
        </p>
      ) : (
        <div className='overflow-x-auto'>
          <table
            className={`w-full border-collapse ${refetching ? 'animate-pulse' : ''}`}
          >
            <thead>
              <tr className='bg-gray-100'>
                <th className='p-2 border border-gray-300 text-left'>ID</th>
                <th className='p-2 border border-gray-300 text-left'>
                  Original File Name
                </th>
                <th className='p-2 border border-gray-300 text-left'>Song</th>
                <th className='p-2 border border-gray-300 text-left'>Selected</th>
                <th className='p-2 border border-gray-300 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <motion.tr
                  key={song.id}
                  className='hover:bg-gray-50'
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {editingId === song.id ? (
                    <SongForm
                      song={song}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      pendingChanges={pendingChanges}
                    />
                  ) : (
                    <SongDisplayRow
                      song={song}
                      pendingChanges={pendingChanges}
                      handleEditClick={handleEditClick}
                      onDelete={onDelete}
                    />
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

function SongForm({ song, onSave, onCancel, pendingChanges }) {
  const [songData, setSongData] = useState({
    fileBase64: '',
    fileName: '',
    fileType: '',
    selected: song.selected,
  });

  function handleFileChange(e) {
    const file = e.target?.files?.[0];

    // check if it is a valid audio file. it must be less than 10MB
    if (file && file instanceof File) {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size must be less than 10MB');
        return;
      }

      // check if it is an audio file
      const fileType = file.type;
      if (!fileType.startsWith('audio/')) {
        toast.error('File must be an audio file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = (e) => {
        setSongData({
          ...songData,
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

  function handleCheckChange(e) {
    setSongData({
      ...songData,
      selected: e.target.checked,
    });
  }

  function handleSaveButtonClick() {
    const dataToSave = {
      id: song.id,
      selected: songData.selected,
    };

    if (songData.fileBase64) {
      dataToSave.fileBase64 = songData.fileBase64;
      dataToSave.fileName = songData.fileName;
      dataToSave.fileType = songData.fileType;
    }

    onSave(dataToSave);
  }

  const fieldId = (fieldName) => `${song.id}-${fieldName}`;

  return (
    <React.Fragment>
      <td className='p-2 border border-gray-300'>{song.id}</td>
      <td className='p-2 border border-gray-300'>{song.fileName}</td>
      <td className='p-2 border border-gray-300'>
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <p className='text-sm font-semibold'>Uploaded:</p>
            <audio controls className='w-full'>
              <source src={`${BACKEND_URL}/${song.url}`} type={song.fileType} />
              Your browser does not support the audio element.
            </audio>
          </div>

          {songData.fileBase64 ? (
            <div className='flex items-center gap-2' key={songData.fileBase64}>
              <p className='text-sm font-semibold'>New:</p>
              <audio controls className='w-full'>
                <source src={songData.fileBase64} />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : null}

          <input
            type='file'
            id={fieldId('songFile')}
            name='songFile'
            onChange={handleFileChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:text-gray-700 file:bg-gray-100 hover:file:bg-gray-200 file:cursor-pointer'
            accept='audio/*'
            readOnly={pendingChanges}
            required
          />
        </div>
      </td>

      <td className='p-2 border border-gray-300'>
        <div className='flex items-center justify-center gap-2'>
          <div class='inline-flex items-center'>
            <label
              class='flex items-center cursor-pointer relative'
              for={fieldId('selected')}
            >
              <input
                type='checkbox'
                class='peer size-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800'
                id={fieldId('selected')}
                name='selected'
                onChange={handleCheckChange}
                checked={songData.selected}
              />
              <span class='absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  class='h-3.5 w-3.5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  stroke='currentColor'
                  stroke-width='1'
                >
                  <path
                    fill-rule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clip-rule='evenodd'
                  ></path>
                </svg>
              </span>
            </label>
          </div>
        </div>
      </td>

      <td className='p-2 border border-gray-300'>
        <div className='flex flex-col items-center gap-2'>
          <button
            onClick={handleSaveButtonClick}
            className='mr-2 text-green-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={pendingChanges}
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className='text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={pendingChanges}
          >
            Cancel
          </button>
        </div>
      </td>
    </React.Fragment>
  );
}

function SongDisplayRow({ song, pendingChanges, handleEditClick, onDelete }) {
  const handleDeleteClick = () => {
    if (confirm('Are you sure you want to delete this song?')) {
      onDelete(song.id);
    }
  };

  return (
    <React.Fragment>
      <td className='p-2 border border-gray-300'>{song.id}</td>
      <td className='p-2 border border-gray-300'>{song.fileName}</td>
      <td className='p-2 border border-gray-300 w-1/2'>
        <audio controls className='w-full'>
          <source src={`${BACKEND_URL}/${song.url}`} type={song.fileType} />
          Your browser does not support the audio element.
        </audio>
      </td>
      <td className='p-2 border border-gray-300'>
        <div className='flex items-center justify-center'>
          {song.selected ? (
            <FaCheck className='text-green-500' />
          ) : (
            <FaXmark className='text-red-500' />
          )}
          <span className='sr-only'>{song.selected ? 'Selected' : 'Not Selected'}</span>
        </div>
      </td>
      <td className='p-2 border border-gray-300'>
        <div className='flex flex-col items-center gap-2'>
          <button
            onClick={() => handleEditClick(song)}
            className='mr-2 text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={pendingChanges}
          >
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className='text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={pendingChanges}
          >
            Delete
          </button>
        </div>
      </td>
    </React.Fragment>
  );
}
