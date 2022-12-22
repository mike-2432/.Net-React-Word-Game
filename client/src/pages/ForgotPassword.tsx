import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import URL from '../URL';

// RESET PASSWORD PAGE //
const Login = () => {
    const navigate = useNavigate();

    // STATES //
    const [ openResetForm, setOpenResetForm] = useState(false);
    const [ alertMsg, setAlertMsg ] = useState([false, ""])
    const [ formValues, setFormValues ] = useState({
        email: "",
        resetToken: "",
        newPassword: "",
    })    

    // FUNCTIONS //
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({...formValues, [e.target.id] : e.target.value})
    }

    const getResetToken = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await fetch(URL+"/api/auth/getPasswordResetToken", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({"email":formValues.email})
            });
            setOpenResetForm(true);
        } catch(err) {
            console.error(err);
        } 
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(URL+"/api/auth/resetPassword", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify(formValues)
            });
            const responseData = await response.text();
            if(response.status===200) navigate("/login");
            else setAlertMsg([true, responseData]);
        } catch(err) {
            console.error(err);
        }     
    }

    // RETURN //
    return (
        <div className="page-container">
            <div className="auth-box">

                <h1>Reset Password</h1>

                <form className="register-form" onSubmit={getResetToken}>
                    <label htmlFor="email">Email</label>
                    <input type="text" 
                        id="email"
                        placeholder="email"
                        value={formValues.email}
                        onChange={handleChange}
                        required    
                    />
                    <button className="reset-submit-btn" type="submit">{openResetForm ? <span>Resend token</span> : <span>Send Reset Token</span>}</button>    
                </form>

                {openResetForm && 
                <form className="register-form" onSubmit={handleSubmit}>
                    <label htmlFor="Reset Token">Reset Token</label>
                    <input type="text" 
                        id="resetToken"
                        placeholder="Reset Token"
                        value={formValues.resetToken}
                        onChange={handleChange}
                        required    
                    />
                    <label htmlFor="New Password">New Password</label>
                    <input type="password" 
                        id="newPassword"
                        placeholder="New Password"
                        value={formValues.newPassword}
                        onChange={handleChange}
                        required    
                    />
                    <button className="reset-submit-btn" type="submit">Submit</button> 
                    {alertMsg && <div className="failed-reset-alert">{alertMsg[1]}</div>}   
                </form>  
                }                

            </div>
        </div>
    )
}

export default Login