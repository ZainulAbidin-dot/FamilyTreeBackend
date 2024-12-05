import React, { useEffect, useState } from 'react';
import Map from '../components/Map/Map';
import FilterPanel from '../components/FilterPanel/FilterPanel';

const MapPage = ({ filteredData,setFilteredData}) => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (filteredData) {
      console.log('Displaying filtered data on the map:', filteredData);
      setMarkers(filteredData);
    }
  }, [filteredData]);

  const handleFilterSubmit = (filterCriteria) => {
    console.log('Filtering data with criteria:', filterCriteria);
    const filtered = filteredData.filter((item) => {
      return (
        (!filterCriteria.zipCode || item.zip.includes(filterCriteria.zipCode)) &&
        (!filterCriteria.city || item.city.toLowerCase().includes(filterCriteria.city.toLowerCase())) &&
        (!filterCriteria.state || item.state.toLowerCase().includes(filterCriteria.state.toLowerCase())) &&
        (!filterCriteria.phoneNumber || item.phoneNumber.includes(filterCriteria.phoneNumber))
      );
    });
    setFilteredData(filtered);
  };

  return (
    <div>
      <div className="text-2xl font-bold mb-4 mt-20"></div>
      <Map markers={markers} />
      <FilterPanel onFilterSubmit={handleFilterSubmit}/>
    </div>
  );
};

export default MapPage;
