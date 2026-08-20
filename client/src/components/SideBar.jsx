import { useNavigate } from 'react-router-dom'
import assets, { userDummyData } from '../assets/assets'

const SideBar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate()

  return (
    <div className={`border-r border-gray-600 h-[100%] ${selectedUser ? 'max-md:hidden' : ''}`}>
      <div className="pb-5">
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt="logo" className='max-w-40' />
          <div className="relative py-2 group">
            <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
            <div className='absolute right-0 top-full mt-2 bg-gray-800 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 w-[150px]'>
              <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className='my-2 border-t border-gray-500' />
              <p className='cursor-pointer text-sm'>Logout</p>
            </div>
          </div>
        </div>

        <div className='flex items-center mt-5 gap-2'>
          <img src={assets.search_icon} alt="Search" className='w-3' />
          <input type="text" placeholder='Search User' className='bg-gray-700 text-white rounded-md px-2 py-1 w-full mt-2' />
        </div>
      </div>

      <div className='flex flex-col'>
        {userDummyData.map((user, index) => (
          <div
            onClick={() => setSelectedUser(user)}
            key={index}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''}`}
          >
            <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
            <div className='flex flex-col leading-5'>
              <p>{user.fullName}</p>
              {index < 3 ? (
                <span className='text-green-400 text-xs'>Online</span>
              ) : (
                <span className='text-neutral-400 text-xs'>Offline</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar