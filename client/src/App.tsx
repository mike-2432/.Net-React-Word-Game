import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute'

// PAGES //
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import User from './pages/User'
import ForgotPassword from './pages/ForgotPassword'
import Game from './pages/Game'
import Construction from './pages/Construction'

// COMPONENTS //
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

// RETURN //
export default function App() {
  return (
    <BrowserRouter>
        {/* Components */}   
        <Navbar />
        <Sidebar />

        {/* Routes */}    
        <Routes>
          {/* Public */}    
          <Route path="/" element={ <Home/> } />    
          <Route path="/login" element={ <Login/> } />
          <Route path="/register" element={ <Register/> } />
          <Route path="/resetPassword" element={ <ForgotPassword/> }></Route>
          <Route path="/game" element={ <Game/> }></Route>
          <Route path="/construction" element={ <Construction/> }></Route>
          {/* Private */}
          <Route element={ <PrivateRoute/> }>
            <Route path="/user" element={ <User/> }/>
          </Route>

        </Routes>      
    </BrowserRouter>
  )
}