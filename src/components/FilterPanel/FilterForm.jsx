import React, { useState } from 'react';

const FilterForm = ({ onSubmit }) => {
  const [filterData, setFilterData] = useState({
    zipCode: '',
    city: '',
    state: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(filterData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="zipCode" className="block text-gray-700 mb-1">
          ZIP Code
        </label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          value={filterData.zipCode}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={filterData.city}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />
      </div>

      <div>
        <label htmlFor="state" className="block text-gray-700 mb-1">
          State
        </label>
        <input
          type="text"
          id="state"
          name="state"
          value={filterData.state}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={filterData.phoneNumber}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none"
      >
        Apply Filters
      </button>
    </form>
  );
};

export default FilterForm;
