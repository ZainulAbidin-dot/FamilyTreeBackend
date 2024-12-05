import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import 'leaflet-draw';

const MapWithPolygon = ({ data, setFilteredData }) => {
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const mapRef = useRef();

  useEffect(() => {
    if (!mapRef.current) return;

    const drawnItems = new L.FeatureGroup();
    mapRef.current.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
      },
    });

    mapRef.current.addControl(drawControl);

    mapRef.current.on(L.Draw.Event.CREATED, (e) => {
      drawnItems.clearLayers(); // Clear previous polygons
      const layer = e.layer;
      drawnItems.addLayer(layer);
      const coordinates = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
      setPolygonCoordinates(coordinates);
      filterDataWithinPolygon(coordinates);
    });
  }, [mapRef]);

  const filterDataWithinPolygon = (coordinates) => {
    const polygonLayer = L.polygon(coordinates);
    const filteredData = data.filter((item) => {
      const point = [item.latitude, item.longitude]; // Adjust keys as needed
      return polygonLayer.contains(L.latLng(point));
    });
    setFilteredData(filteredData);
  };

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      className="h-96 w-full mt-4 rounded-lg shadow-md"
      whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {polygonCoordinates.length > 0 && <Polygon positions={polygonCoordinates} color="blue" />}
    </MapContainer>
  );
};

export default MapWithPolygon;
