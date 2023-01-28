import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../Context';
import URL from '../URL';
import ChangePass from '../components/ChangePassword';

// USER PAGE //
const User = () => {
    const navigate = useNavigate();
    const [ username, setUsername] = useState<string>("");
    const [ email, setEmail ] = useState<string>("");
    const { jwt, setJwt, classicHS, setClassicHS } = useGlobalContext();

    // FUNCTIONS //
    useEffect(() => {
        const getUserDetails = async() => {
            const response = await fetch(URL+"/api/auth/getDetails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwt,
                }                
            });
            const details = await response.json();
            if(details) {
                setUsername(details.data.Username);
                setEmail(details.data.Email);
            }
        }
        getUserDetails();
    },[jwt])

    const handleLogout = () => {
        setJwt("");
        setClassicHS("0");
        navigate("/");
    }

    // RETURN //
    return (
        <div className="user-page-container">
            <div className="user-page-text-box">
                <h1>Welcome {username}</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>   
            </div>

            <div className="user-page-text-box">
                <h2>High Score = {classicHS}</h2>  
            </div>

            <div className="user-page-change-pass">
                <ChangePass/>
            </div>                                 
        </div>
    )
}

export default User