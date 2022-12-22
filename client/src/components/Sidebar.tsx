import { useGlobalContext } from '../Context';
import { Link } from 'react-router-dom';

// SIDEBAR COMPONENT //
const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar, jwt} = useGlobalContext();

    return (
        <div className={`${isSidebarOpen ? "sidebar show-sidebar" : "sidebar"}` }>
            <ul>
                {jwt 
                    ? <Link to="/user"><li onClick={toggleSidebar}>Profile</li></Link>
                    : <Link to="/login"><li onClick={toggleSidebar}>Login</li></Link>           
                }      
                <Link to="/"><li onClick={toggleSidebar}>Home</li></Link>
                <a href="https://github.com/mike-2432"><li onClick={toggleSidebar}>Github</li></a>
            </ul>
        </div>
    )
}

export default Sidebar