import React, { useState } from 'react';
import { AddSongForm } from '../components/SongManagement/AddSongForm';
import { axiosClient } from '../axios-client';
import { useAxiosQuery } from '../hooks/useAxiosQuery';
import { Loader } from '../components/loader/Loader';
import { toast } from 'react-hot-toast';
import { SongList } from '../components/SongManagement/SongList';
import { Container } from '../components/common/Container';

const SongManagementPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false); // Track the visibility of the form
  const [pendingChanges, setPendingChanges] = useState(false);

  const {
    data: songs,
    setData: setSongs,
    refetch,
    refetching,
    loading,
  } = useAxiosQuery('/songs', {
    transformData: (data) => {
      return data.map((song) => {
        return {
          id: song.id,
          fileName: song.file_name,
          fileType: song.file_type,
          url: song.url,
          selected: song.selected,
        };
      });
    },
  });

  const handleAddSong = async (songData) => {
    setPendingChanges(true);

    const promise = axiosClient.post('/songs', songData);

    toast
      .promise(promise, {
        loading: 'Adding Song...',
        success: 'Song Added Successfully',
        error: 'Error Adding Song',
      })
      .then(() => {
        refetch();
      })
      .finally(() => {
        setPendingChanges(false);
        setIsFormVisible(false);
      });
  };

  const handleEditSong = async (songData) => {
    setPendingChanges(true);

    const promise = axiosClient.patch(`/songs/${songData.id}`, songData);

    toast
      .promise(promise, {
        loading: 'Updating Song...',
        success: 'Song Updated Successfully',
        error: 'Error Updating Song',
      })
      .then(() => {
        refetch();
      })
      .finally(() => {
        setPendingChanges(false);
      });
  };

  const handleDeleteSong = async (id) => {
    setPendingChanges(true);
    const promise = axiosClient.delete(`/songs/${id}`);
    toast
      .promise(promise, {
        loading: 'Deleting Song...',
        success: 'Song Deleted Successfully',
        error: (error) => {
          return error?.response?.data || 'Error Deleting Song';
        },
      })
      .then(() => {
        setSongs((prevData) => prevData.filter((song) => song.id !== id));
      })
      .finally(() => {
        setPendingChanges(false);
      });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h1 className='text-3xl font-bold mb-4'>Songs Management</h1>

      <button
        onClick={() => {
          setIsFormVisible(true);
        }}
        className='my-4 p-2 bg-blue-500 text-white rounded'
      >
        Add New Song
      </button>

      {isFormVisible && (
        <AddSongForm
          onCancel={() => setIsFormVisible(false)}
          onSave={handleAddSong}
          pendingChanges={pendingChanges}
        />
      )}

      <SongList
        songs={songs}
        onEdit={handleEditSong}
        onDelete={handleDeleteSong}
        pendingChanges={pendingChanges}
        refetching={refetching}
      />
    </Container>
  );
};

export default SongManagementPage;
