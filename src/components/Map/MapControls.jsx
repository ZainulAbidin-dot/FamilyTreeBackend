import React from 'react';
import { useMap } from 'react-leaflet';
import { motion } from 'framer-motion';

const MapControls = ({ setCenter, initialPosition }) => {
  const map = useMap();

  const resetView = () => {
    setCenter(initialPosition);
    map.setView(initialPosition, 13);
  };

  const toggleLayers = () => {
    // Example function for toggling layers (extend as needed)
    alert('Layer toggling not yet implemented.');
  };

  return (
    <motion.div
      className="absolute top-4 right-4 flex flex-col space-y-2 bg-white p-2 shadow-lg rounded-md z-20"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => map.setZoom(map.getZoom() + 1)}
        className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none"
      >
        Zoom In
      </button>
      <button
        onClick={() => map.setZoom(map.getZoom() - 1)}
        className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none"
      >
        Zoom Out
      </button>
      <button
        onClick={resetView}
        className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none"
      >
        Reset View
      </button>
      <button
        onClick={toggleLayers}
        className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none"
      >
        Toggle Layers
      </button>
    </motion.div>
  );
};

export default MapControls;
