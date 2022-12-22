import { FaBars, FaUserAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../Context';

// NAVBAR COMPONENT //
const Navbar = () => {
    const { toggleSidebar, jwt } = useGlobalContext();

    return (
        <nav className="navbar">
            <div className="navbar-center">

                {/* Logo */}
                <Link to="/">
                    <div className="navbar-logo"><h2>Word Smith</h2></div>
                </Link>

                {/* Links */}
                <div className="navbar-links">
                    <ul>
                        <Link to="/"><li>Home</li></Link>
                        <Link to="/user"><li>Profile</li></Link>
                        <a href="https://github.com/mike-2432"><li>Github</li></a>
                    </ul>
                </div>

                {/* Account */}
                {jwt 
                    ? <Link to="/user"><div className="navbar-account"><FaUserAlt/></div></Link>
                    : <Link to="/login"><div className="navbar-login">Login</div></Link>           
                }                

                {/* Menu Button */}
                <div className="navbar-menu-btn" onClick={toggleSidebar}><FaBars/></div>               
                
            </div>
        </nav>
    )
}

export default Navbar