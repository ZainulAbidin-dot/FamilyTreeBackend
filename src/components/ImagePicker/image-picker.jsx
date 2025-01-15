import { useState, useRef } from 'react';
import { FaPencil, FaXmark } from 'react-icons/fa6';
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from 'react-image-crop';
import setCanvasPreview from './SetCanvasPreview';
import toast from 'react-hot-toast';

import 'react-image-crop/dist/ReactCrop.css';

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

export function ImagePicker({ imgSrc, setImgSrc, disabled, id }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file instanceof File) {
      // check if it is an image file
      const fileType = file.type;
      if (!fileType.startsWith('image/')) {
        toast.error('File must be an image file');
        return;
      }

      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const imageElement = new Image();
        const imageUrl = reader.result?.toString() || '';
        imageElement.src = imageUrl;

        imageElement.addEventListener('load', (e) => {
          const { naturalWidth, naturalHeight } = e.currentTarget;
          if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
            toast.error('Image must be at least 150 x 150 pixels.');
            return setImgSrc('');
          }
        });
        setImgSrc(imageUrl);
      });
      reader.readAsDataURL(file);
    } else {
      toast.error('Invalid file');
      return;
    }
  };

  return (
    <div className='space-y-4'>
      {/* IMAGE UPLOAD INPUT */}
      <input
        type='file'
        accept='image/*'
        id={id}
        className='mt-1 p-2 w-full border border-gray-300 rounded'
        onChange={onSelectFile}
        disabled={disabled}
        readOnly={disabled}
      />

      {/* DISPLAY IMAGE WITH ICON TO ENTER CROP MODE */}
      {imgSrc && (
        <div className='relative w-[150px] h-[150px] rounded-full border-2 border-gray-400'>
          <img
            src={imgSrc}
            alt='Image'
            className='w-full h-full object-cover rounded-full'
          />
          <button
            className='absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600'
            title='Edit'
            type='button'
            onClick={openModal}
            disabled={disabled}
            readOnly={disabled}
          >
            <FaPencil className='w-4 h-4 text-white' />
          </button>
        </div>
      )}

      {/* MODAL TO CROP IMAGE */}
      {isModalOpen && (
        <Modal updateImage={setImgSrc} closeModal={closeModal} imgSrc={imgSrc} />
      )}
    </div>
  );
}

const Modal = ({ updateImage, closeModal, imgSrc }) => {
  return (
    <div
      className='relative z-10'
      aria-labelledby='crop-image-dialog'
      role='dialog'
      aria-modal='true'
    >
      <div className='fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm'></div>
      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full justify-center px-2 py-12 text-center '>
          <div className='relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-gray-800 text-slate-100 text-left shadow-xl transition-all'>
            <div className='grid gap-4 h-full'>
              <div className='px-5 py-4 flex items-center justify-end'>
                <button
                  type='button'
                  className='rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none'
                  onClick={closeModal}
                >
                  <span className='sr-only'>Close menu</span>
                  <FaXmark className='w-6 h-6' />
                </button>
              </div>
              <div className='flex-1 flex flex-col items-center'>
                <ImageCropper
                  imgSrc={imgSrc}
                  closeModal={closeModal}
                  updateImage={updateImage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageCropper = ({ imgSrc, closeModal, updateImage }) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState('');

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: '%',
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  return (
    <>
      <ReactCrop
        crop={crop}
        onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
        circularCrop
        keepSelection
        aspect={ASPECT_RATIO}
        minWidth={MIN_DIMENSION}
      >
        <img
          ref={imgRef}
          src={imgSrc}
          alt='Upload'
          style={{ maxHeight: '70vh' }}
          onLoad={onImageLoad}
        />
      </ReactCrop>
      <button
        className='text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600'
        type='button'
        onClick={() => {
          setCanvasPreview(
            imgRef.current, // HTMLImageElement
            previewCanvasRef.current, // HTMLCanvasElement
            convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
          );
          const dataUrl = previewCanvasRef.current.toDataURL();
          updateImage(dataUrl);
          closeModal();
        }}
      >
        Crop Image
      </button>

      {crop && (
        <canvas
          ref={previewCanvasRef}
          className='mt-4'
          style={{
            display: 'none',
            border: '1px solid black',
            objectFit: 'contain',
            width: 150,
            height: 150,
          }}
        />
      )}
    </>
  );
};
