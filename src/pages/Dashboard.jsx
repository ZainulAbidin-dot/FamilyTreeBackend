import { motion } from 'framer-motion';
import { useAxiosQuery } from '../hooks/useAxiosQuery';
import { Loader } from '../components/loader/Loader';

const Dashboard = () => {
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

  const { data: overview, loading } = useAxiosQuery('/overview');

  if (loading) {
    return <Loader />;
  }

  return (
    <motion.div
      className='max-w-5xl mx-auto p-6'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <h1 className='text-3xl font-bold mb-6 text-center'>Dashboard Overview</h1>

      <motion.div
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6'
        variants={itemVariants}
      >
        <motion.div
          className='bg-white h-40 p-10 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300'
          whileHover={{ scale: 1.05 }}
        >
          <h2 className='text-xl font-semibold mb-2'>Total Families</h2>
          <p className='text-gray-600'>
            {loading ? 'Loading...' : overview?.familiesCount}
          </p>
        </motion.div>

        <motion.div
          className='bg-white h-40 p-10 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300'
          whileHover={{ scale: 1.05 }}
        >
          <h2 className='text-xl font-semibold mb-2'>Total Family Members</h2>
          <p className='text-gray-600'>
            {loading ? 'Loading...' : overview?.familyMembersCount}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
