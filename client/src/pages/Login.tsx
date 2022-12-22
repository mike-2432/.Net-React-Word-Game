import React, { useState } from 'react';
import { useGlobalContext } from '../Context';
import { Link, useNavigate } from 'react-router-dom';
import URL from '../URL';

// LOGIN PAGE //
const Login = () => {
    const navigate = useNavigate();

    // STATES //
    const { setJwt } = useGlobalContext();
    const [ alertMsg, setAlertMsg ] = useState({show:false, message:""});
    const [ formValues, setFormValues ] = useState({
        username: "",
        password: "",
    })

    const formInputs = [
        {
            id: 1,
            name: "username",
            type: "text",
            placeholder: "Username",
            label: "Username",
        },
        {
            id: 2,
            name: "password",
            type: "password",
            placeholder: "Password",
            label: "Password",
        }
    ]

    // FUNCTIONS //
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({...formValues, [e.target.id] : e.target.value})
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(URL+"/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formValues)
            });
            const jsonResponse = await response.json();
            const token = jsonResponse.data;
            if(token) {
                setJwt(token);  
                navigate("/user");
            } else {
                setAlertMsg({show:true, message:"Incorrect Combination"});
            }       
        } catch(err) {
            setAlertMsg({show:true, message:"Could not connect to the server"});
        }
    }

    // RETURN //
    return (
        <div className="page-container">
            <div className="auth-box">

                <h1>Login</h1>
                
                <form className="login-form" onSubmit={handleSubmit}>
                    {formInputs.map((formInput) => {
                        let { id, name, type, placeholder, label } = formInput;                    
                        return (
                            <div key={id}>
                                <label htmlFor={label}>{label}</label>
                                <input type={type} 
                                    placeholder={placeholder} 
                                    id={name} 
                                    value={formValues[name as keyof typeof formValues] || ''} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>                        
                        )
                    })}
                    {alertMsg && <div className="failed-login-alert">{alertMsg.message}</div>}
                    <button className="auth-submit-btn" type="submit">Login</button>                    
                </form>  

                <div className="underline"></div>

                <div className="login-page-other">
                    <Link to="/register"><p>Register</p></Link>
                    {/*  <Link to="/resetPassword"><p>Forgot Password</p></Link>  */}
                </div>               

            </div>
        </div>
    )
}

export default Login