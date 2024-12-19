import { useAxiosQuery } from '../hooks/useAxiosQuery';
import { Loader } from '../components/loader/Loader';
import { Container } from '../components/common/Container';
import { FaUser, FaMusic } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';

const Dashboard = () => {
  const { data: overview, loading } = useAxiosQuery('/overview');

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h1 className='text-3xl font-bold mb-6 text-center'>Dashboard Overview</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6'>
        <DashboardCard
          title='Total Families'
          value={overview?.familiesCount}
          icon={FaUserGroup}
        />

        <DashboardCard
          title='Total Family Members'
          value={overview?.familyMembersCount}
          icon={FaUser}
        />

        <DashboardCard title='Total Songs' value={overview?.songsCount} icon={FaMusic} />
      </div>
    </Container>
  );
};

function DashboardCard({ title, value, icon: Icon }) {
  return (
    <div className='bg-white h-40 p-10 shadow-md rounded-md hover:shadow-lg transition-shadow duration-300'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold mb-2'>{title}</h2>
        <Icon className='size-4' />
      </div>
      <p className='text-gray-600'>{value}</p>
    </div>
  );
}

export default Dashboard;
