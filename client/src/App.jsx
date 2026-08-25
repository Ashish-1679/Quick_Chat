import { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import assets from './assets/assets'
import { AuthContext } from '../context/AuthContext'
import {Toaster} from "react-hot-toast"
const App = () => {
  const {authUser} = useContext(AuthContext)
  return (
    <div className="bg-cover bg-center" style={{ backgroundImage: `url(${assets.bgImage})` }}>
      <Toaster/>
      <Routes>
        <Route path="/" element={authUser?<HomePage />:<Navigate to = "/login"/>} />
        <Route path="/login" element={!authUser?<LoginPage />:<Navigate to = "/"/>} />
        <Route path="/profile" element={authUser?<ProfilePage />:<Navigate to = "/login"/>} />
      </Routes>
    </div>
  )
}

export default App