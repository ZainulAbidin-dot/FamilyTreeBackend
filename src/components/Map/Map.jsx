import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import MapControls from './MapControls';
import FilterPanel from '../FilterPanel/FilterPanel';

// Default coordinates (center of the map)
const initialPosition = [37.0902, -95.7129]; // Center of the US
const polygonCoordinates = [
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047],
];

const Map = ({ markers }) => {
  const [center, setCenter] = useState(initialPosition);
  const [geoMarkers, setGeoMarkers] = useState([]);

  useEffect(() => {
    const geocodeMarkers = async () => {
      const geocodedMarkers = await Promise.all(
        markers.map(async (marker) => {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&postalcode=${marker.zip}&country=US`
          );
          const data = await response.json();
          if (data.length > 0) {
            return {
              ...marker,
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon),
            };
          }
          console.warn(`Could not geocode ZIP: ${marker.zip}`);
          return null; // Handle missing coordinates gracefully
        })
      );
      setGeoMarkers(geocodedMarkers.filter((m) => m !== null));
    };

    geocodeMarkers();
  }, [markers]);

  const handleMapClick = (e) => {
    console.log('Map clicked at:', e.latlng);
  };

  return (
    <div className="map-container w-full h-[500px] relative z-10">
      <MapContainer
        center={center}
        zoom={5}
        className="h-full w-full"
        style={{ height: '500px', width: '100%' }}
        whenCreated={(mapInstance) => {
          mapInstance.on('click', handleMapClick);
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render Markers */}
        {geoMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lon]}
            title={`${marker.firstName} ${marker.lastName}`}
          />
        ))}

        {/* Render Polygon */}
        <Polygon positions={polygonCoordinates} color="purple" />

        {/* Custom Map Controls */}
        <MapControls setCenter={setCenter} initialPosition={initialPosition} />
      </MapContainer>
    </div>
  );
};

export default Map;
