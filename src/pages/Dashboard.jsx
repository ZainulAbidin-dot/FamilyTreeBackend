import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Dashboard = ({ exportCount, importCount, userCount }) => {
  const containerVariants = {
    hidden: { opacity: 0, x: '-100vw' },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 10,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
      },
    },
  };

  const [familiesData, setFamiliesData] = useState();
  const [familyMembers, setFamilyMembers] = useState();

  
  useEffect(() => {
    async function fetchData() {
      const {data} = await axios.get('https://family-tree-backend-production-630e.up.railway.app/families', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const familyMembersData = await axios.get('https://family-tree-backend-production-630e.up.railway.app/family-members', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setFamilyMembers(familyMembersData.data)

      const populateUser = data.map(user => {
        return {
          id: user.id,
          familyHeadName: user.family_head_name,
          familyName: user.family_name
        }
      })
      setFamiliesData(populateUser) 
    }

    fetchData();
  
  }, [])

  return (
    <motion.div
      className="container mx-auto mt-20 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">
        Dashboard Overview
      </h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        {/* Export Data Count Card */}
        <motion.div
          className="bg-white h-40 p-10 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold mb-2">Total Families</h2>
          <p className="text-gray-600">{familiesData?.length > 0 ? familiesData.length : "Loading..."}</p>
        </motion.div>

        {/* Import Data Count Card */}
        <motion.div
          className="bg-white h-40 p-10 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold mb-2">Total Family Members</h2>
          <p className="text-gray-600">{familyMembers?.length > 0 ? familyMembers?.length : "Loading..." }</p>
        </motion.div>

        {/* User Count Card */}
        {/* <motion.div
          className="bg-white h-40 p-10 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-gray-600">{userCount} users</p>
        </motion.div> */}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
