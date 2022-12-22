import { useState, useEffect } from 'react';
import { useGlobalContext } from '../Context';
import URL from '../URL';

// CHANGE PASSWORD COMPONENT //
const ChangePassword = ({email}:any) => {

    // STATES //
    const { jwt } = useGlobalContext();
    const [ alertMsg, setAlertMsg ] = useState([false, ""]);

    const [ formValues, setFormValues ] = useState({
        oldPassword: "",
        newPassword: "",
        repeatPassword: "",
    })

    const formInputs = [
        {
            id: 1,
            name: "oldPassword",
            type: "password",
            placeholder: "Old Password",
            label: "Old Password",
        },
        {
            id: 2,
            name: "newPassword",
            type: "password",
            placeholder: "New Password",
            label: "New Password",
        },
        {
            id: 3,
            name: "repeatPassword",
            type: "password",
            placeholder: "Repeat Password",
            label: "Repeat Password",
        }
    ]

    // FUNCTIONS //
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({...formValues, [e.target.id] : e.target.value})
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(URL+"/api/auth/changePassword", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+jwt,
                },
                mode: 'cors',
                body: JSON.stringify(formValues)
            });
            const jsonResponse = await response.json();   
            if(response.status!==200) {
                setAlertMsg([true, jsonResponse.message])
            } else {
                setAlertMsg([true, "Password has been changed"])
            }
        } catch(err) {
            console.error(err);
        }
    }

    // RETURN //
    return (
        <>
            <h1>Change Password</h1>

            <form className="change-password" onSubmit={handleSubmit}>
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
                <button className="change-password-btn" type="submit">Change Password</button>
                {alertMsg && <div className="change-password-alert">{alertMsg[1]}</div>}
            </form>
        </>
    )
}

export default ChangePassword